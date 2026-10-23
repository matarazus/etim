# etim

Espaço privado de amigos, com chat e chamadas WebRTC. Frontend estático em `index.html`, `styles.css` e `app.js`; Supabase fornece autenticação, dados e Realtime. Cloudflare TURN é obtido pela Edge Function existente.

- [Atualização: chamadas, canais e Spotify Jam](docs/ATUALIZACAO_ETIM.md)
- [Migration do Supabase](supabase/migrations/20261023170000_group_channels_jam.sql) — aplicar no projeto existente antes do frontend; instruções no relatório.
- [Testes WebRTC e suas limitações](tests/webrtc/README.md)
- [Correções anteriores de negociação](docs/CORRECOES_WEBRTC.md)

```sh
cd tests/webrtc
npm ci
npm test
```

A publicação deve aguardar o GitHub Actions com mídia RTP obrigatória e a validação da migration. Não inclua segredos no frontend. A chave publishable/anon de `config.js` é pública; a autorização depende das políticas e RPCs do Supabase.
