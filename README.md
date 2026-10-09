# NekoPlay v0.2 — páginas separadas e Supabase

## O que mudou
O site agora tem páginas diferentes: login/cadastro (`index.html`), catálogo (`catalog.html`), detalhes (`anime.html`), player (`watch.html`), favoritos (`favorites.html`) e conta (`account.html`). O usuário entra antes de acessar o catálogo. Favoritos são guardados na tabela `favorites` do Supabase e vinculados ao usuário autenticado.

## Passo 1 — configurar Supabase
1. Crie um projeto em https://supabase.com/.
2. Copie a Project URL e a chave pública `anon`/`publishable` do painel do projeto.
3. Abra `config.js` e substitua os dois valores `COLE_AQUI...`.
4. Nunca use `service_role` ou segredos no frontend.

## Passo 2 — criar a tabela
No Supabase, abra SQL Editor, crie uma query, cole todo o `supabase-schema.sql` e execute. As políticas RLS restringem leitura, inserção e remoção dos favoritos ao próprio usuário. Se executar o SQL mais de uma vez e aparecer erro de política já existente, remova as políticas existentes no painel ou recrie a tabela/políticas com cuidado.

## Passo 3 — autenticação
No Supabase, abra Authentication → URL Configuration. Configure a URL publicada como Site URL e inclua a URL nas Redirect URLs. Confirme que o provedor Email está ativado. Dependendo das opções de confirmação por e-mail, o cadastro pode pedir confirmação antes do primeiro login.

## Passo 4 — publicar gratuitamente
Envie todos os arquivos para a raiz de um repositório GitHub. Depois, em Settings → Pages, publique a branch `main` na pasta `/ (root)`. Aguarde a URL do site e cadastre-a na configuração de URL do Supabase. O nível gratuito pode ter limites e os termos dos serviços podem mudar.

## Como adicionar episódios
Edite `catalog.json`. `sourceType: "direct"` usa o player HTML5 com uma URL direta de arquivo compatível (MP4/WebM) que você tem direito de transmitir. `sourceType: "official"` aceita links de incorporação do YouTube `/embed/` ou Vimeo `player.vimeo.com/video/` quando a plataforma e o titular autorizam. Não contorne DRM, bloqueios de incorporação, autenticação ou direitos autorais.

Os títulos atuais são fictícios e não incluem vídeos reais. Capas, sinopses, legendas e músicas também podem ter direitos próprios.

## Limitações desta versão
- O login usa Supabase Auth; favoritos sincronizam na conta.
- Não há painel de administrador; edite `catalog.json` manualmente.
- Favoritos exigem a tabela e as políticas RLS.
- O player não é universal; serviços externos podem limitar integração.
- Vídeos não são hospedados pelo projeto. Hospedagem de vídeo, domínio próprio, licenças ou tráfego elevado podem gerar custos.
- O catálogo protegido não será disponibilizado automaticamente. Adicione apenas fontes autorizadas.
