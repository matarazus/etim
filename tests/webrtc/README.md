# Testes da auditoria WebRTC

Estes testes descrevem contratos de funcionamento correto. **A versão auditada falha; um resultado vermelho é evidência para a correção, não uma suíte aprovada.** Nenhum teste é marcado como falha esperada para esconder defeitos.

A branch de correção agora passa em 29 dos 35 testes localmente, com seis testes RTP bloqueados pelo ambiente e nenhum teste falhando. Os resultados e limites estão em [CORRECOES_WEBRTC.md](../../docs/CORRECOES_WEBRTC.md). O workflow do GitHub exige RTP sem skips para validar a liberação.

A execução completa no [GitHub Actions](https://github.com/matarazus/etim/actions/runs/39975512632) foi aprovada com os testes RTP obrigatórios. A limitação local não se aplica a esse resultado remoto; a validação de Safari real permanece separada.

## Executar

Requisitos: Node.js 24+, npm e Chromium/Chrome com suporte a WebRTC. Não requer Supabase nem credenciais.

```sh
cd tests/webrtc
npm ci
npx playwright install chromium
npm test
```

Por padrão usa o Chromium instalado pelo Playwright; se indisponível, tenta `/usr/bin/chromium`. Para escolher outro executável:

```sh
CHROMIUM_PATH=/caminho/para/chrome npm test
```

Em Linux pode ser necessário instalar dependências do navegador seguindo a documentação do Playwright. O download depende dos domínios oficiais do Playwright e dos destinos de redirecionamento; não desative TLS. Neste ambiente, `cdn.playwright.dev` respondeu HTTP 403 e o Chromium do sistema tem a política `WebRtcIPHandling=disable_non_proxied_udp`. Essas restrições não foram alteradas.

Para validação de liberação, exigir execução de mídia (falta de candidatos ICE torna-se erro, não skip):

```sh
REQUIRE_WEBRTC_MEDIA=1 npm test
```

Uma execução com skips de RTP não autoriza liberação. Cada teste guarda um JSON próprio em `results/`: versão do navegador, commit, SDP resumido, transceivers, contadores RTP, sinais e erros. O runner mantém código de saída diferente de zero se qualquer contrato falhar. Para relatório TAP:

```sh
node --test --test-reporter=tap --test-concurrency=1 audit.test.cjs turn.test.cjs > results/run.tap 2>&1
```

Crie `results/` antes de redirecionar, caso ainda não exista. O diretório é ignorado pelo Git; a evidência da auditoria está em `../../docs/`.

## O que é real e o que é simulado

- O próprio `app.js` é carregado pelo navegador. Uma inserção **somente na resposta HTTP do servidor de testes** expõe funções e estado da closure para observação. O arquivo de produção não é alterado.
- `RTCPeerConnection`, SDP, `RTCRtpSender`, `RTCRtpReceiver`, transceivers e estatísticas são implementações nativas do Chromium. Dois ou três contextos de navegador isolam participantes.
- Captura de câmera/microfone usa os dispositivos artificiais oficiais do Chromium. Não acessa câmera ou microfone físico do operador.
- A tela é uma fonte `canvas.captureStream()` animada; o RTP/codec é real quando há transporte disponível. O teste **não** valida o seletor de compartilhamento do sistema operacional, áudio de sistema nem permissões do Safari.
- Supabase Auth, Presence, Broadcast e o carregamento TURN são fronteiras simuladas em memória. Isso permite ordem de chegada, atraso e perda controlados sem gravar no grupo real. A negociação e o tratamento dessas mensagens continuam sendo do aplicativo.
- O construtor RTC registra a configuração solicitada pelo aplicativo, mas usa `iceServers: []` no laboratório. Assim, os testes são locais e não usam TURN nem STUN públicos. O teste de inicialização TURN verifica a ordem de criação/configuração, não a alocação de relay.
- Requisições externas de fontes/CDN são bloqueadas no laboratório, pois não participam da lógica RTC. O navegador recebe permissões artificiais e autoplay liberado: sucesso aqui não valida políticas de autoplay reais.
- `turn.test.cjs` executa o corpo TypeScript original da Edge Function, removendo tipos com Node. Autenticação do wrapper, banco e Cloudflare são fixtures; os testes verificam respostas HTTP e fluxo de autorização, **não** JWT/RLS/CORS implantados.
- O teste `control binding ...` é um experimento independente da correção proposta. Seu sucesso comprova a associação SDP da topologia alternativa, não que o `app.js` esteja corrigido.

## Cobertura e limites

Inclui duas ordens de entrada, três participantes, câmera durante chamada, câmera + tela simultâneas, saída/reentrada, permissões atrasadas, mute durante recuperação, sinal atrasado de sessão anterior, ordem de inicialização TURN e perda de resposta de renegociação.

Se o navegador não fornecer candidatos ICE host, os seis testes que precisam de RTP são explicitamente ignorados e informam a limitação. Os testes de SDP e ciclo de vida continuam executando, inclusive suas asserções que falham. A ausência de pacotes nesse ambiente **não é atribuída ao aplicativo**.

Não existe Safari real neste Linux. Playwright WebKit também não estava instalado; mesmo instalado, não substituiria Safari/iOS com dispositivos reais. A matriz de validação complementar está no relatório. Os testes de RTP foram criados, mas sua aprovação ainda está pendente.
