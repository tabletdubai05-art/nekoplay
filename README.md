# NekoPlay v0.3 — player e três episódios

Esta versão evolui o projeto v0.2 mantendo a estrutura de login, catálogo, detalhes, favoritos, conta e integração Supabase.

## Novidades
- Aventura Estelar agora tem três episódios cadastrados.
- Página do player melhorada para MP4/WebM HTTPS e incorporações permitidas do YouTube/Vimeo.
- Navegação para episódio anterior/próximo.
- Estados claros quando o vídeo ainda não foi configurado ou falha ao carregar.
- A página de detalhes informa quais episódios ainda estão sem fonte.

## Importante antes de publicar
O ZIP não contém episódios de anime nem URLs de vídeo. Os títulos são demonstrativos. Para manter o projeto legal, adicione apenas vídeos próprios, autorizados pelo titular ou distribuídos sob uma licença que permita essa exibição. Não use links de streaming pirateados e não contorne DRM, login ou bloqueios de incorporação.

## Como configurar os três episódios
Edite `catalog.json`. Para cada episódio, defina `sourceType` como `direct` e coloque em `sourceUrl` uma URL HTTPS pública de um MP4/WebM que você tenha direito de transmitir. Exemplo de formato (não é um vídeo real):

```json
{
  "number": 1,
  "title": "O mapa brilhante",
  "duration": "12 min",
  "sourceType": "direct",
  "sourceUrl": "https://SEU-HOST-LEGAL/episodio-1.mp4"
}
```

O servidor de vídeo precisa permitir reprodução pelo navegador e, quando aplicável, requisições CORS. Uma URL de página de um site de vídeo não é o mesmo que uma URL direta de arquivo MP4.

## Atualizar o site já publicado
Para evitar sobrescrever sua configuração real do Supabase, envie ao repositório existente **somente** estes arquivos atualizados: `catalog.json`, `watch-page.js`, `anime-page.js` e `styles.css`. Não substitua o `config.js` que já funciona no seu site pela cópia-modelo deste ZIP, pois a cópia deste pacote contém valores de exemplo. Não é necessário recriar o repositório nem refazer a configuração do GitHub Pages.

## Supabase
A autenticação e os favoritos continuam usando os arquivos e a tabela `favorites` existentes. Esta versão não exige uma nova SQL.
