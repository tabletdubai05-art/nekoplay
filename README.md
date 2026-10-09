# NekoPlay — protótipo de streaming (R$ 0 para começar)

Este é um protótipo estático, responsivo e em português. Ele demonstra um catálogo próprio, pesquisa, filtros por gênero, favoritos locais, páginas de detalhes, episódios e um player misto.

## Arquivos

- `index.html` — estrutura do site
- `styles.css` — identidade visual responsiva
- `app.js` — catálogo, busca, favoritos e player
- `catalog.json` — títulos e fontes dos episódios

## Importante sobre direitos e fontes

Os títulos incluídos são **exemplos fictícios**, não episódios reais. Não há vídeos protegidos incluídos.

- `sourceType: "direct"` usa o player HTML5 para uma URL direta de arquivo de vídeo compatível, como MP4/WebM. Use apenas arquivos que você criou ou para os quais tenha autorização expressa de transmissão.
- `sourceType: "official"` aceita somente endereços de incorporação reconhecidos no código: YouTube `/embed/`, `youtube-nocookie.com/embed/` ou Vimeo `player.vimeo.com/video/`. Verifique as permissões, a disponibilidade e os termos do serviço antes de usar.
- O protótipo não contorna DRM, bloqueios de incorporação, autenticação ou restrições geográficas. Não transforma links comuns de páginas em fontes diretas.
- Capas, logos, sinopses, legendas e músicas também podem ter direitos próprios. Use material autorizado e credite quando a licença exigir.
- Um vídeo incorporável não significa automaticamente que todos os usos promocionais ou comerciais estão autorizados.

## Como testar no celular

O jeito mais simples é publicar no GitHub Pages, porque abrir `index.html` diretamente pode impedir que `catalog.json` seja carregado por algumas restrições do navegador.

### Publicar com GitHub Pages

1. Crie uma conta em https://github.com/ se ainda não tiver.
2. No GitHub, crie um repositório novo, por exemplo `nekoplay`.
3. Envie os quatro arquivos deste projeto para a raiz do repositório (`index.html`, `styles.css`, `app.js`, `catalog.json`).
4. Abra **Settings → Pages**.
5. Em **Build and deployment**, selecione **Deploy from a branch**.
6. Escolha a branch `main` e a pasta `/ (root)`, depois salve.
7. Aguarde a publicação e abra o endereço informado na página do GitHub Pages.

A interface e o catálogo podem ser hospedados no plano gratuito dentro dos limites e termos atuais do GitHub Pages. O GitHub Pages não hospeda vídeos grandes como serviço de streaming.

## Como adicionar ou editar um anime

Edite `catalog.json`. Cada anime tem um `id` único, título, ano, gêneros, sinopse e uma lista `episodes`.

Exemplo de episódio com vídeo direto autorizado:

```json
{
  "number": 1,
  "title": "Episódio de demonstração",
  "duration": "10 min",
  "sourceType": "direct",
  "sourceUrl": "https://SEU-HOST-AUTORIZADO.example/video.mp4",
  "notes": "Vídeo autorizado"
}
```

Substitua o endereço de exemplo por uma URL real fornecida por um host que permita essa transmissão. Não use o endereço ilustrativo literalmente.

Exemplo de incorporação oficial do YouTube:

```json
{
  "number": 1,
  "title": "Curta autorizado",
  "duration": "8 min",
  "sourceType": "official",
  "sourceUrl": "https://www.youtube.com/embed/ID_DO_VIDEO",
  "notes": "Incorporação permitida pelo titular"
}
```

Troque `ID_DO_VIDEO` pelo ID de um vídeo real e confirme que a incorporação está habilitada e que você tem permissão para usá-lo.

## Limitações atuais

- Sem contas de usuário ou sincronização de favoritos entre dispositivos.
- Favoritos ficam no armazenamento local do navegador.
- Não há painel de administração: a edição é feita em `catalog.json`.
- O player não remove anúncios nem altera controles de players externos.
- Alguns arquivos diretos podem não funcionar por incompatibilidade de formato, CORS ou restrições do servidor.
- Não inclui sistema de legendas próprio, CDN, transcodificação, banco de dados ou hospedagem de vídeo.
- O custo pode deixar de ser zero se você precisar de domínio próprio, licenças, backend ou hospedagem de vídeo com grande tráfego.

## Próximas melhorias sugeridas

1. Criar uma página de detalhes separada por URL.
2. Adicionar fontes e obras independentes com autorização documentada.
3. Criar painel administrativo protegido se houver backend.
4. Implementar legendas apenas para vídeos em que você tenha direitos sobre as faixas de legenda.
