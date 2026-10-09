# NekoPlay — v0.4 arquitetura do player

Esta atualização mantém login, catálogo, detalhes, favoritos e integração com Supabase existentes. O player agora suporta configuração de áudio por episódio e seleção de legendas WebVTT por episódio, além do formato antigo de fonte direta e incorporações permitidas.

## Novidades
- Menu de áudio baseado nas fontes configuradas por episódio.
- Menu de legendas com opção de desativar e faixas de idioma WebVTT.
- Troca de faixa de áudio por fontes de vídeo separadas, com tentativa de manter a posição e o estado de reprodução.
- Documentação com exemplo de configuração e requisitos de hospedagem.
- Nenhum arquivo de episódio é incluído.

## Atualização segura
No site já publicado, substitua somente `watch-page.js` e `styles.css`. Preserve `config.js`; não precisa rodar SQL novamente. Consulte `ARQUITETURA-PLAYER-PUBLICO.md` para configurar fontes autorizadas. Não configure nem publique conteúdo protegido sem autorização do titular.
