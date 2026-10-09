const state = {
  catalog: null,
  genre: "Todos",
  query: "",
  favoritesOnly: false,
  favorites: new Set(JSON.parse(localStorage.getItem("nekoplay-favorites") || "[]"))
};

const $ = (selector, root = document) => root.querySelector(selector);
const grid = $("#catalogGrid");
const detailsDialog = $("#detailsDialog");
const playerDialog = $("#playerDialog");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}
function saveFavorites() {
  localStorage.setItem("nekoplay-favorites", JSON.stringify([...state.favorites]));
}
function titleSymbol(title) {
  const symbols = ["✦", "月", "星", "夢", "猫", "✧"];
  let sum = 0;
  for (const char of title) sum += char.charCodeAt(0);
  return symbols[sum % symbols.length];
}
function filteredAnime() {
  return state.catalog.anime.filter(anime => {
    const matchesQuery = `${anime.title} ${anime.description} ${anime.genres.join(" ")}`.toLowerCase().includes(state.query.toLowerCase());
    const matchesGenre = state.genre === "Todos" || anime.genres.includes(state.genre);
    const matchesFavorite = !state.favoritesOnly || state.favorites.has(anime.id);
    return matchesQuery && matchesGenre && matchesFavorite;
  });
}
function renderFilters() {
  const filters = $("#genreFilters");
  filters.innerHTML = state.catalog.genres.map(genre =>
    `<button class="filter-chip ${genre === state.genre ? "active" : ""}" data-genre="${escapeHtml(genre)}">${escapeHtml(genre)}</button>`
  ).join("");
  filters.querySelectorAll("[data-genre]").forEach(button => {
    button.addEventListener("click", () => {
      state.genre = button.dataset.genre;
      state.favoritesOnly = false;
      $("#favoritesNav").textContent = "♡ Minha lista";
      renderFilters();
      renderCatalog();
    });
  });
}
function renderCatalog() {
  const animeList = filteredAnime();
  $("#resultCount").textContent = `${animeList.length} ${animeList.length === 1 ? "título" : "títulos"}`;
  $("#emptyState").classList.toggle("hidden", animeList.length !== 0);
  grid.classList.toggle("hidden", animeList.length === 0);
  grid.innerHTML = animeList.map(anime => {
    const favorite = state.favorites.has(anime.id);
    return `<article class="anime-card" data-open="${escapeHtml(anime.id)}" tabindex="0" role="button" aria-label="Ver ${escapeHtml(anime.title)}">
      <div class="poster"><span class="poster-art">${escapeHtml(titleSymbol(anime.title))}</span><span class="poster-tag">${escapeHtml(anime.status)}</span><div class="poster-title">${escapeHtml(anime.title)}<small>${escapeHtml(anime.year)} · ANIMAÇÃO</small></div></div>
      <div class="card-info"><div class="card-topline"><span>${escapeHtml(anime.rating || "Classificação não informada")}</span><span>${anime.episodes.length} ep.</span></div><h3 class="card-title">${escapeHtml(anime.title)}</h3><div class="genre-list">${anime.genres.map(escapeHtml).join(" · ")}</div>
      <div class="card-actions"><button class="small-action" data-details="${escapeHtml(anime.id)}">Ver detalhes</button><button class="small-action favorite" data-favorite="${escapeHtml(anime.id)}" aria-label="${favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}">${favorite ? "♥" : "♡"}</button></div></div></article>`;
  }).join("");
  grid.querySelectorAll("[data-details]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation(); openDetails(button.dataset.details);
  }));
  grid.querySelectorAll("[data-favorite]").forEach(button => button.addEventListener("click", event => {
    event.stopPropagation(); toggleFavorite(button.dataset.favorite);
  }));
  grid.querySelectorAll("[data-open]").forEach(card => {
    card.addEventListener("click", () => openDetails(card.dataset.open));
    card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openDetails(card.dataset.open); } });
  });
}
function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    showToast("Removido da sua lista.");
  } else {
    state.favorites.add(id);
    showToast("Adicionado à sua lista!");
  }
  saveFavorites();
  renderCatalog();
  if (detailsDialog.open) openDetails(id);
}
function openDetails(id) {
  const anime = state.catalog.anime.find(item => item.id === id);
  if (!anime) return;
  const favorite = state.favorites.has(id);
  $("#detailsContent").innerHTML = `<div class="details-hero"><p class="eyebrow">${escapeHtml(anime.status)} · ${escapeHtml(anime.year)}</p><h2>${escapeHtml(anime.title)}</h2><p>${escapeHtml(anime.genres.join(" · "))} · ${escapeHtml(anime.rating || "Classificação não informada")}</p></div>
  <p class="details-description">${escapeHtml(anime.description)}</p>
  <div class="hero-actions"><button class="button button-primary" id="detailFavorite">${favorite ? "♥ Na minha lista" : "♡ Adicionar à lista"}</button></div>
  <h3>Episódios</h3><div class="episode-list">${anime.episodes.map(episode => `<div class="episode-row"><span class="episode-number">${String(episode.number).padStart(2, "0")}</span><div class="episode-row-info"><strong>${escapeHtml(episode.title)}</strong><small>${escapeHtml(episode.duration || "Duração não informada")}</small></div><button class="episode-play" data-play="${escapeHtml(id)}" data-episode="${episode.number}">▶ Assistir</button></div>`).join("")}</div>`;
  $("#detailFavorite").addEventListener("click", () => toggleFavorite(id));
  $("#detailsContent").querySelectorAll("[data-play]").forEach(button => button.addEventListener("click", () => openPlayer(id, Number(button.dataset.episode))));
  if (!detailsDialog.open) detailsDialog.showModal();
}
function safeDirectUrl(url) {
  try {
    const parsed = new URL(url, window.location.href);
    return ["https:", "http:"].includes(parsed.protocol) && !["javascript:", "data:", "blob:"].includes(parsed.protocol) ? parsed.href : "";
  } catch { return ""; }
}
function officialEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    // Somente URLs de incorporação conhecidas. Não transforma páginas de vídeo em embeds.
    if (host === "www.youtube-nocookie.com" && parsed.pathname.startsWith("/embed/")) return parsed.href;
    if ((host === "www.youtube.com" || host === "youtube.com") && parsed.pathname.startsWith("/embed/")) return parsed.href;
    if (host === "player.vimeo.com" && parsed.pathname.startsWith("/video/")) return parsed.href;
    return "";
  } catch { return ""; }
}
function openPlayer(animeId, episodeNumber) {
  const anime = state.catalog.anime.find(item => item.id === animeId);
  const episode = anime?.episodes.find(item => item.number === episodeNumber);
  if (!anime || !episode) return;
  if (detailsDialog.open) detailsDialog.close();
  let mediaMarkup = "";
  let note = "";
  if (episode.sourceType === "direct") {
    const url = safeDirectUrl(episode.sourceUrl || "");
    if (url) {
      mediaMarkup = `<video controls playsinline preload="metadata" src="${escapeHtml(url)}">Seu navegador não consegue reproduzir este vídeo.</video>`;
      note = "Player HTML5 para um arquivo direto. Use apenas arquivos que você tem autorização para transmitir. A origem do vídeo precisa permitir acesso pelo navegador (CORS, quando aplicável).";
    } else {
      mediaMarkup = `<div class="player-placeholder"><div class="big-play">▶</div><h3>Fonte de vídeo ainda não configurada</h3><p>Este episódio é apenas um exemplo. Edite <strong>catalog.json</strong> e preencha <strong>sourceUrl</strong> com uma URL HTTPS de vídeo autorizado em formato compatível, como MP4 ou WebM.</p></div>`;
      note = "Nenhum vídeo será reproduzido até você adicionar uma fonte legítima.";
    }
  } else if (episode.sourceType === "official") {
    const url = officialEmbedUrl(episode.sourceUrl || "");
    if (url) {
      mediaMarkup = `<iframe src="${escapeHtml(url)}" title="${escapeHtml(anime.title + " — " + episode.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      note = "Incorporação oficial. Respeite as condições do serviço e do titular dos direitos. Não é possível personalizar ou controlar todos os elementos do player externo.";
    } else {
      mediaMarkup = `<div class="player-placeholder"><div class="big-play">↗</div><h3>Incorporação oficial não configurada</h3><p>Adicione uma URL de player incorporável permitida (por exemplo, um endereço /embed/ do YouTube ou /video/ do Vimeo), verificando antes as permissões do vídeo.</p></div>`;
      note = "Links de páginas comuns e fontes não aprovadas não são convertidos automaticamente em player.";
    }
  } else {
    mediaMarkup = `<div class="player-placeholder"><h3>Fonte não reconhecida</h3><p>Em catalog.json, use sourceType: direct ou sourceType: official.</p></div>`;
  }
  $("#playerContent").innerHTML = `<div class="player-shell"><p class="eyebrow">AGORA ASSISTINDO</p><h2>${escapeHtml(anime.title)} — ${escapeHtml(episode.title)}</h2><p class="player-meta">Episódio ${episode.number} · ${escapeHtml(episode.duration || "Duração não informada")}</p><div class="video-frame">${mediaMarkup}</div><p class="player-controls-note">${escapeHtml(note)}</p><div class="episode-list">${anime.episodes.map(ep => `<div class="episode-row"><span class="episode-number">${String(ep.number).padStart(2,"0")}</span><div class="episode-row-info"><strong>${escapeHtml(ep.title)}</strong><small>${escapeHtml(ep.duration || "")}</small></div><button class="episode-play" data-next-episode="${ep.number}" ${ep.number === episode.number ? "disabled" : ""}>${ep.number === episode.number ? "Reproduzindo" : "Assistir"}</button></div>`).join("")}</div></div>`;
  $("#playerContent").querySelectorAll("[data-next-episode]").forEach(button => button.addEventListener("click", () => openPlayer(animeId, Number(button.dataset.nextEpisode))));
  playerDialog.showModal();
}
function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  if (id === "playerDialog") {
    const video = dialog.querySelector("video");
    if (video) { video.pause(); video.removeAttribute("src"); video.load(); }
    const iframe = dialog.querySelector("iframe");
    if (iframe) iframe.src = "about:blank";
  }
  dialog.close();
}
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => closeDialog(button.dataset.close)));
[detailsDialog, playerDialog].forEach(dialog => dialog.addEventListener("click", event => {
  if (event.target === dialog) closeDialog(dialog.id);
}));
$("#searchInput").addEventListener("input", event => { state.query = event.target.value.trim(); renderCatalog(); });
$("#favoritesNav").addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  state.genre = "Todos";
  $("#favoritesNav").textContent = state.favoritesOnly ? "♥ Minha lista" : "♡ Minha lista";
  renderFilters(); renderCatalog();
  $("#catalogo").scrollIntoView({ behavior: "smooth" });
});
$("#randomButton").addEventListener("click", () => {
  const list = state.catalog.anime;
  if (list.length) openDetails(list[Math.floor(Math.random() * list.length)].id);
});
$("#homeLink").addEventListener("click", event => { event.preventDefault(); state.favoritesOnly = false; state.genre = "Todos"; state.query = ""; $("#searchInput").value = ""; renderFilters(); renderCatalog(); window.scrollTo({top:0,behavior:"smooth"}); });
async function init() {
  try {
    const response = await fetch("catalog.json");
    if (!response.ok) throw new Error("Não foi possível carregar catalog.json");
    state.catalog = await response.json();
    document.title = `${state.catalog.site.name} — Anime e animação`;
    document.querySelectorAll(".brand span:last-child").forEach(el => { el.innerHTML = escapeHtml(state.catalog.site.name).replace("Play", '<span class="accent">Play</span>'); });
    renderFilters();
    renderCatalog();
  } catch (error) {
    grid.innerHTML = `<div class="empty-state"><h3>Não foi possível carregar o catálogo</h3><p>Abra o site por uma hospedagem estática ou servidor local. Alguns navegadores bloqueiam fetch de arquivos JSON quando o HTML é aberto diretamente como arquivo.</p><p>${escapeHtml(error.message)}</p></div>`;
    $("#resultCount").textContent = "Erro ao carregar";
  }
}
init();
