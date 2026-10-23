# Atualização de chamadas e espaço do etim

Base: `main` em `54bc625bdbc65a31faf08ccfaf142a28db2583a6`. O aplicativo continua estático (HTML/CSS/JavaScript), com Supabase Realtime, WebRTC e a função Cloudflare TURN existente.

## Comportamento

- Uma câmera/tela remota só entra na grade se a pessoa anunciar essa mídia na mesma sala/sessão e a faixa estiver ativa, viva e sem mute. Slots negociados continuam disponíveis para WebRTC e diagnóstico, sem criar players visíveis. O player aguarda o primeiro quadro; bloqueio de autoplay oferece uma ação de reprodução.
- Ao desligar câmera/tela, o estado é anunciado imediatamente; o player é pausado, desconectado de `srcObject` e removido. `mute`, `unmute` e `ended` também atualizam a interface. As conexões e os senders de áudio são preservados.
- Clique no vídeo ou no botão de ampliar para destacá-lo. As outras transmissões viram miniaturas. “Voltar ao grid” restaura a grade; o fim da mídia selecionada restaura o grid automaticamente. `object-fit: contain` preserva a imagem inteira, inclusive no celular.
- “Conectado há HH:MM:SS” usa um único intervalo por chamada e o horário de entrada. Aparece na chamada, no status lateral e no aviso ao voltar ao chat. Trocar câmera/tela não o reinicia; sair ou fechar a página limpa os timers.
- “Ouvir juntos” abre instruções para criar uma Jam no Spotify e permite compartilhar, copiar, abrir, atualizar ou remover o convite da sala. Qualquer membro pode atualizar o convite. Remover no etim não encerra a Jam no Spotify.
- `⋯` ao lado dos canais permite editar nome/descrição. `+` cria canais de texto ou voz. Excluir pede confirmação e faz exclusão lógica, preservando mensagens; os oito canais originais estão protegidos no banco. Excluir uma sala criada pelos usuários desconecta seus ocupantes após sincronização.
- `⋯` no cabeçalho do espaço edita o nome de exibição e a descrição. A marca, o título do aplicativo, cores e arquitetura permanecem etim por padrão.
- Controles principais ficam juntos; ferramentas de áudio, recuperação e diagnóstico ficam em “Mais opções”. Há foco visível, navegação por teclado nos diálogos, retorno de foco e feedback de sucesso/erro.

## Spotify: alcance e validação

A integração não usa OAuth, Spotify Web API, senhas, endpoints para criar Jam nem reprodução musical pelo WebRTC. A criação, reprodução, validade dos convites e requisitos de Premium continuam no Spotify. O link HTTPS abre o app quando o sistema reconhece o vínculo; caso contrário, abre o site oficial. O etim não consegue verificar se um convite expirou nem se um link curto representa uma Jam: o participante deve copiar o convite correto.

A lista permitida, validada no cliente e no banco, aceita:

- `https://spotify.link/<token>`
- `https://open.spotify.com/jam/<token>`
- Opcionalmente `?si=<token>`; tokens aceitam letras, números, `_` e `-`.

Outros domínios, HTTP, credenciais na URL, portas explícitas, fragmentos, parâmetros de redirecionamento e caminhos de músicas/playlists são rejeitados. Se o Spotify mudar o formato oficial do convite, atualizar as duas validações e os respectivos testes. Links externos usam `noopener noreferrer`.

## Aplicar a migration no Supabase

Arquivo: [`../supabase/migrations/20261023170000_group_channels_jam.sql`](../supabase/migrations/20261023170000_group_channels_jam.sql).

1. Use o projeto Supabase já conectado ao etim. Faça um backup/snapshot do banco antes da atualização e confira o esquema existente. A migration pressupõe `public.club_members(user_id uuid)` e `public.chat_messages(channel text)`, com o login e a função `join_club` já funcionando. Ela não substitui a configuração inicial nem altera a senha, contas, políticas de membros, políticas de chat ou TURN.
2. No painel **SQL Editor → New query**, cole o arquivo completo e execute **uma única vez**, como proprietário do banco. A transação é atômica: se ocorrer erro, nenhuma alteração parcial deve ser aplicada. Não execute fragmentos nem apague os dados para corrigir incompatibilidades.
3. A migration cria `etim_channels`, `etim_group_settings`, `etim_room_jams`, RLS e quatro RPCs de escrita. Somente sessões autenticadas cujo `auth.uid()` já existe em `club_members` podem ler/alterar esses dados. Login anônimo do Supabase sem admissão em `join_club` não basta. Escritas diretas nas tabelas ficam bloqueadas para clientes; nomes, tipos, URLs e canais protegidos são validados no banco.
4. Os IDs originais (`geral`, `jogos`, `memes`, `links`, `ideias`, `resenha`, `jogatina`, `cantinho`) são preservados. Renomear muda apenas a apresentação, sem mover mensagens. A migration substitui CHECKs que dependem **exclusivamente** da coluna `chat_messages.channel` por um trigger que exige canal de texto ativo. Regras de corpo/autoria e políticas RLS existentes são mantidas. Se houver ENUMs, FKs ou políticas personalizadas com uma lista fixa de canais, adapte essas regras ao catálogo antes de liberar criação de canais. Não houve acesso administrativo ao esquema de produção para inspecioná-las.
5. Confira em **Database → Publications → supabase_realtime** se as três novas tabelas estão habilitadas. A migration as adiciona automaticamente quando essa publication existe. O canal privado `etim:lobby` e suas políticas de Broadcast/Presence continuam os existentes.
6. Execute as consultas abaixo para conferir tabelas, RLS, publicação e políticas anteriores. A seguir, entre com dois amigos no etim, renomeie um canal e compartilhe uma Jam; ambos devem ver as mudanças. Recarregue a página do segundo cliente e confirme a persistência.
7. Só publique o frontend após aprovação dos testes do PR e da migration. Todos os participantes devem recarregar a página. A migration é aditiva para o frontend anterior; se o frontend novo for carregado antes dela, chat/chamadas continuam disponíveis e a interface avisa que os novos recursos precisam de configuração.

```sql
select id, kind, name, protected, archived_at from public.etim_channels order by sort_order;
select relname, relrowsecurity from pg_class
where oid in ('public.etim_channels'::regclass,
              'public.etim_group_settings'::regclass,
              'public.etim_room_jams'::regclass);
select tablename from pg_publication_tables
where pubname = 'supabase_realtime' and schemaname = 'public';
select policyname, cmd, qual, with_check from pg_policies
where schemaname='public' and tablename='chat_messages';
select conname, pg_get_constraintdef(oid) from pg_constraint
where conrelid='public.chat_messages'::regclass;
```

Não publique chave `service_role` no site. A migration usa o usuário autenticado e a participação existente no grupo. Não acrescenta administração de contas ou exclusão de amigos offline.

Para reverter a interface, restaure a versão anterior do frontend; mantenha as novas tabelas para não perder configurações e convites. Canais novos não aparecerão no frontend antigo. Restaurar um canal excluído é uma ação manual do proprietário no SQL Editor: definir `archived_at = null`, resolvendo antes possíveis nomes duplicados. Não apague as tabelas como parte de um rollback de frontend.

## Testes e limites

Execute:

```sh
cd tests/webrtc
npm ci
npm test
# Liberação: exigir RTP nativo, sem skips por falta de ICE
REQUIRE_WEBRTC_MEDIA=1 npm test
```

A suíte preserva os 35 testes anteriores e acrescenta testes de players inativos, presença/eventos de faixa, descarte de frames, destaque/miniaturas desktop e mobile, timer e limpeza, ciclos nativos de câmera/tela com áudio, menus/diálogos, persistência e sincronização de configurações/Jam, URLs e permissões SQL. O servidor de testes expõe a closure apenas na resposta HTTP; a produção não expõe hooks de teste.

Os testes de banco executam a migration real em PostgreSQL embarcado (PGlite), com papéis `anon`/`authenticated`, membros e não membros. O teste entre dois clientes usa esse banco e simula o transporte Supabase nas fronteiras. Isso valida SQL/RLS/RPCs e comportamento da interface, mas não valida a implantação do Realtime, JWT, `join_club` ou políticas preexistentes no Supabase de produção.

No ambiente local, o Chromium instalado bloqueia UDP sem proxy: testes de RTP informam skip explicitamente. O GitHub Actions exige `REQUIRE_WEBRTC_MEDIA=1`; uma execução local com skips não substitui essa verificação. Safari real, iPhone, Android com captura física, seletor de tela do sistema, Cloudflare TURN implantado e reprodução real de uma Jam com contas Spotify precisam da verificação manual abaixo. Nenhum teste automatizado acessa a sala ou contas reais dos amigos.

### Verificação manual antes da publicação

- Dois navegadores desktop (Chrome e Safari): entrar em ambas as ordens; confirmar áudio nas duas direções. Ligar/desligar câmera três vezes, depois tela três vezes, mantendo microfone ativo. Não devem sobrar players ou frames congelados.
- Repetir câmera + tela simultâneas, terminar pelo botão do etim e pelo controle do navegador. A mídia restante e o áudio devem continuar.
- Adicionar um terceiro participante; repetir destaque, troca de seleção e fim da transmissão selecionada. Conferir também com 6–8 amigos.
- Safari/iPhone e Android: assistir, abrir/fechar destaque, voltar ao chat, alternar apps e retornar; conferir autoplay, orientação e contador. Compartilhar a própria tela depende do suporte do navegador móvel.
- Recarregar/ressubscrever um cliente e conferir nomes, descrições e Jam. Criar canal, enviar mensagem, renomear e excluir com confirmação. Tentar excluir canal principal deve ser negado também via RPC.
- Criar uma Jam no Spotify, copiar seu convite real e testá-lo em outra conta/dispositivo; confirmar exigências Premium no próprio Spotify. Atualizar/remover no etim não controla a sessão musical.
- Abrir o diagnóstico e conferir tráfego de áudio/vídeo e conexão TURN quando a rede exigir relay. Conferir console e liberação de câmera/microfone depois de sair.

## Arquivos

- `app.js`: estado de mídia, foco, contador, diálogos, catálogo compartilhado e Jam.
- `index.html`: ações do espaço/canais e status de duração.
- `styles.css`: grade/destaque responsivos, controles, menus, foco e Jam.
- `supabase/migrations/20261023170000_group_channels_jam.sql`: catálogo, configurações, convites, RPCs, RLS e validação de canais de mensagem.
- `tests/webrtc/features.test.cjs`, `database.test.cjs`, `database.cjs`: novos testes de interface, sincronização e SQL.
- `tests/webrtc/harness.cjs`, `package.json`, `package-lock.json`: observabilidade de teste, limpeza da captura artificial e dependência SQL apenas de desenvolvimento.
- `README.md` e este relatório: execução, implantação e limitações.

A função `supabase/functions/etim-turn/index.ts`, `config.js`, senha geral, chat, perfis e arquitetura de sinalização WebRTC não foram substituídos.

### Resultado local desta atualização

Em 23/10/2026, a suíte contém 46 testes. A validação local terminou com 39 aprovados, 7 skips explícitos de RTP e nenhuma falha. `node --check app.js` e `git diff --check` também passaram. Os testes de interface verificam ausência de exceções JavaScript; avisos de TURN/CDN bloqueados e erros provocados intencionalmente pertencem ao laboratório. Capturas de câmera/tela são artificiais. A etapa de liberação exige a execução integral correspondente ao commit do PR no GitHub Actions.
