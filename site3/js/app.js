/**
 * app.js: interface, eventos e estado. Serve a página inicial e a de favoritos.
 */
import { searchTitles, discoverTitles, getGenres, getDetails, imageUrl, hasApiKey } from './api.js';
import { getFavorites, isFavorite, toggleFavorite, setApiKey } from './storage.js';

const $ = (selector) => document.querySelector(selector);
const isFavoritesPage = document.body.dataset.page === 'favorites';
const MAX_PAGES = 500; // limite do TMDB

const state = { type: 'movie', query: '', genre: '', page: 1, totalPages: 1 };
const registry = new Map(); // chave "tipo-id" -> título (usado pela delegação de eventos)
let lastRequest = 0; // descarta respostas antigas se o usuário buscar de novo

/* ---------- helpers de DOM ---------- */

/** Cria um elemento: el('p', { class: 'x', textContent: 'oi' }, filho1, filho2) */
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([name, value]) => {
    if (name === 'class') node.className = value;
    else if (name === 'dataset') Object.assign(node.dataset, value);
    else if (name in node) node[name] = value;
    else node.setAttribute(name, value);
  });
  node.append(...children);
  return node;
}

const keyOf = (item) => `${item.type}-${item.id}`;

function normalize(result, type) {
  return {
    id: result.id,
    type,
    title: result.title || result.name || 'Sem título',
    poster: result.poster_path,
    rating: result.vote_average,
    year: (result.release_date || result.first_air_date || '').slice(0, 4),
    genreIds: result.genre_ids || [],
  };
}

function showStatus(message, isError = false) {
  const status = $('#status');
  status.textContent = message;
  status.classList.toggle('error', isError);
}

function setLoading(isLoading) {
  $('#spinner').hidden = !isLoading;
  $('#grid').setAttribute('aria-busy', String(isLoading));
}

const updateFavCount = () => { $('#fav-count').textContent = getFavorites().length; };

/* ---------- cards e favoritos ---------- */

function paintFav(button, item) {
  const on = isFavorite(item.id, item.type);
  const full = button.dataset.variant === 'full';
  button.classList.toggle('on', on);
  button.setAttribute('aria-pressed', String(on));
  button.setAttribute('aria-label', `${on ? 'Remover' : 'Adicionar'} ${item.title} ${on ? 'dos' : 'aos'} favoritos`);
  button.textContent = full ? (on ? '♥ Nos favoritos' : '♡ Favoritar') : (on ? '♥' : '♡');
}

function createCard(item) {
  registry.set(keyOf(item), item);

  const poster = item.poster
    ? el('img', { src: imageUrl(item.poster), alt: `Pôster de ${item.title}`, loading: 'lazy' })
    : el('div', { class: 'no-poster', textContent: 'Sem pôster' });
  const details = [item.year, item.rating ? `★ ${item.rating.toFixed(1)}` : ''].filter(Boolean);
  const meta = el('span', { class: 'meta' },
    el('strong', { textContent: item.title }),
    el('span', { textContent: details.join(' | ') }));

  const open = el('button', { class: 'open', type: 'button', dataset: { action: 'open' } }, poster, meta);
  const fav = el('button', { class: 'fav', type: 'button', dataset: { action: 'fav', favKey: keyOf(item) } });
  paintFav(fav, item);

  return el('li', { class: 'card', dataset: { key: keyOf(item) } }, open, fav);
}

function renderGrid(items) {
  $('#grid').replaceChildren(...items.map(createCard));
}

function onToggleFavorite(item) {
  toggleFavorite(item);
  updateFavCount();
  if (isFavoritesPage) renderFavorites();
  document.querySelectorAll(`[data-fav-key="${keyOf(item)}"]`).forEach((btn) => paintFav(btn, item));
}

/* ---------- modal de detalhes ---------- */

let currentItem = null;

function buildDetails(data, item) {
  const modal = $('#modal');
  const runtime = data.runtime
    ? `${data.runtime} min`
    : data.number_of_seasons ? `${data.number_of_seasons} temporada(s)` : '';
  const facts = [item.year, runtime, ...(data.genres || []).map((genre) => genre.name)].filter(Boolean);

  const poster = data.poster_path
    ? el('img', { class: 'big-poster', src: imageUrl(data.poster_path, 'w500'), alt: `Pôster de ${item.title}` })
    : el('div', { class: 'no-poster big-poster', textContent: 'Sem pôster' });
  const fav = el('button', { class: 'fav-full', type: 'button', dataset: { action: 'fav', favKey: keyOf(item), variant: 'full' } });
  paintFav(fav, item);

  return el('article', { class: 'details' },
    el('button', { class: 'close', type: 'button', 'aria-label': 'Fechar', textContent: '×', onclick: () => modal.close() }),
    poster,
    el('div', { class: 'info' },
      el('h2', { textContent: data.title || data.name }),
      data.tagline ? el('p', { class: 'tagline', textContent: data.tagline }) : '',
      el('ul', { class: 'facts' }, ...facts.map((fact) => el('li', { textContent: fact }))),
      el('p', { class: 'rating', textContent: data.vote_average
        ? `★ ${data.vote_average.toFixed(1)} de 10 (${data.vote_count} votos)` : 'Ainda sem nota' }),
      el('p', { textContent: data.overview || 'Este título ainda não tem sinopse em português.' }),
      fav));
}

async function openDetails(item) {
  const modal = $('#modal');
  currentItem = item;
  modal.replaceChildren(el('p', { class: 'modal-msg', textContent: 'Carregando detalhes…' }));
  modal.showModal();
  try {
    modal.replaceChildren(buildDetails(await getDetails(item.type, item.id), item));
  } catch (error) {
    modal.replaceChildren(
      el('p', { class: 'modal-msg error', textContent: error.message }),
      el('button', { class: 'close', type: 'button', textContent: 'Fechar', onclick: () => modal.close() }));
  }
}

/* ---------- página inicial: busca, filtros, paginação ---------- */

function handleError(error) {
  $('#grid').replaceChildren();
  $('#pagination').hidden = true;
  showStatus(error.message, true);
  if (error.code === 'NO_KEY') $('#key-banner').hidden = false;
}

function updatePagination() {
  $('#pagination').hidden = state.totalPages <= 1;
  $('#page-info').textContent = `Página ${state.page} de ${state.totalPages}`;
  $('#prev').disabled = state.page <= 1;
  $('#next').disabled = state.page >= state.totalPages;
}

async function load() {
  const requestId = ++lastRequest;
  setLoading(true);
  showStatus('');
  $('#grid').replaceChildren();
  try {
    const data = state.query
      ? await searchTitles(state.type, state.query, state.page)
      : await discoverTitles(state.type, state.genre, state.page);
    if (requestId !== lastRequest) return;

    let items = data.results.map((result) => normalize(result, state.type));
    // A busca do TMDB não filtra por gênero, então filtramos os resultados da página.
    if (state.query && state.genre) items = items.filter((item) => item.genreIds.includes(Number(state.genre)));

    state.totalPages = Math.min(data.total_pages, MAX_PAGES) || 1;
    renderGrid(items);
    updatePagination();
    showStatus(items.length
      ? (state.query ? `${data.total_results} resultado(s) para "${state.query}".` : 'Populares do momento.')
      : 'Nenhum título encontrado. Tente outro nome ou gênero.');
  } catch (error) {
    if (requestId === lastRequest) handleError(error);
  } finally {
    if (requestId === lastRequest) setLoading(false);
  }
}

async function loadGenres() {
  const select = $('#genre-select');
  try {
    const genres = await getGenres(state.type);
    select.replaceChildren(el('option', { value: '', textContent: 'Todos' }),
      ...genres.map((genre) => el('option', { value: String(genre.id), textContent: genre.name })));
  } catch (error) {
    console.warn('Não foi possível carregar os gêneros:', error.message);
  }
}

function applyQuery(value) {
  const query = value.trim();
  if (query === state.query) return;
  state.query = query;
  state.page = 1;
  load();
}

function goToPage(page) {
  state.page = page;
  load();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initHome() {
  // Campo da chave: aparece logo de início se não houver chave, e pode ser reaberto pelo botão do topo.
  const banner = $('#key-banner');
  banner.hidden = hasApiKey();
  $('#key-toggle').addEventListener('click', () => {
    banner.hidden = !banner.hidden;
    if (!banner.hidden) $('#key-input').focus();
  });

  let timer;
  $('#search-form').addEventListener('submit', (event) => {
    event.preventDefault(); // evita recarregar a página
    clearTimeout(timer);
    applyQuery($('#search-input').value);
  });
  $('#search-input').addEventListener('input', (event) => {
    clearTimeout(timer);
    timer = setTimeout(() => applyQuery(event.target.value), 500); // busca ao digitar
  });

  document.querySelectorAll('.segmented button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.segmented button').forEach((other) => {
        const active = other === button;
        other.classList.toggle('active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      state.type = button.dataset.type;
      state.genre = '';
      state.page = 1;
      loadGenres();
      load();
    });
  });

  $('#genre-select').addEventListener('change', (event) => {
    state.genre = event.target.value;
    state.page = 1;
    load();
  });

  $('#prev').addEventListener('click', () => goToPage(state.page - 1));
  $('#next').addEventListener('click', () => goToPage(state.page + 1));

  $('#key-form').addEventListener('submit', (event) => {
    event.preventDefault();
    setApiKey($('#key-input').value.trim());
    $('#key-banner').hidden = true;
    loadGenres();
    load();
  });

  loadGenres();
  load();
}

/* ---------- página de favoritos ---------- */

function renderFavorites() {
  const favorites = getFavorites();
  renderGrid(favorites);
  showStatus(favorites.length
    ? `${favorites.length} título(s) salvo(s) neste navegador.`
    : 'Nenhum favorito ainda. Na página Descobrir, toque no coração de um título para salvá-lo aqui.');
}

/* ---------- início ---------- */

function init() {
  window.claqueteReady = true; // sinaliza ao index.html que o JavaScript carregou
  updateFavCount();

  // Delegação de eventos: um listener para todos os cards e para o modal.
  $('#grid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    const card = event.target.closest('.card');
    if (!button || !card) return;
    const item = registry.get(card.dataset.key);
    if (button.dataset.action === 'fav') onToggleFavorite(item);
    else openDetails(item);
  });

  const modal = $('#modal');
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close(); // clique no fundo fecha
    else if (event.target.closest('[data-action="fav"]')) onToggleFavorite(currentItem);
  });

  if (isFavoritesPage) renderFavorites();
  else initHome();
}

init();
