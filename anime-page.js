async function init(){
  const u=await userRequired();if(!u)return;
  document.querySelector("#header").innerHTML=header(u.email);
  const c=await catalog(),set=await favorites(u.id),a=c.anime.find(x=>x.id===new URLSearchParams(location.search).get("id")),root=document.querySelector("#content");
  if(!a){root.innerHTML='<section class="section"><h1>Anime não encontrado</h1><a class="btn primary" href="catalog.html">Voltar</a></section>';return}
  function render(){root.innerHTML=`<section class="detail"><div class="detail-art"><img src="${esc(a.cover||'covers/capa-padrao.svg')}" alt="Capa de ${esc(a.title)}" onerror="this.onerror=null;this.src='covers/capa-padrao.svg'"></div><div><p class="eyebrow">${esc(a.status)} · ${a.year}</p><h1>${esc(a.title)}</h1><p class="muted">${a.genres.map(esc).join(" · ")}</p><p class="muted">${esc(a.description)}</p><button id="heart" class="btn ${set.has(a.id)?"":"primary"}">${set.has(a.id)?"♥ Na minha lista":"♡ Adicionar à minha lista"}</button><h2 style="margin-top:30px">Episódios (${a.episodes.length})</h2><div class="episodes">${a.episodes.map(e=>{const ready=Boolean((e.sourceUrl||"").trim()||(Array.isArray(e.audioTracks)&&e.audioTracks.some(t=>t.sourceUrl)));return `<div class="episode"><b>${String(e.number).padStart(2,"0")}</b><div><strong>${esc(e.title)}</strong><small>${esc(e.duration||"Duração não informada")} · ${ready?"Vídeo configurado":"Vídeo pendente"}</small></div><a class="btn primary" href="watch.html?id=${encodeURIComponent(a.id)}&ep=${e.number}">▶ ${ready?"Assistir":"Abrir player"}</a></div>`}).join("")}</div><p class="notice">Os episódios só podem ser exibidos depois de adicionar uma fonte de vídeo autorizada em catalog.json.</p></div></section>`;
    document.querySelector("#heart").onclick=async()=>{try{await toggle(u.id,a.id,set);render()}catch(e){console.error(e);toast("Erro ao salvar. Confira o Supabase.")}};
  }
  render();
}
init().catch(error=>{console.error(error);const root=document.querySelector("#content");if(root)root.innerHTML='<section class="section"><h1>Erro ao carregar o anime</h1><p class="muted">Confira sua conexão, catálogo e configuração do Supabase.</p></section>'});
