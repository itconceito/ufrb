/**
 * api.js: comunicação com a API do TMDB (https://developer.themoviedb.org).
 */
import { TMDB_API_KEY } from './config.js';
import { getApiKey } from './storage.js';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p';

export const hasApiKey = () => Boolean(getApiKey() || TMDB_API_KEY);

export const imageUrl = (path, size = 'w342') => `${IMAGE_URL}/${size}${path}`;

function keyError(message) {
  const error = new Error(message);
  error.code = 'NO_KEY'; // faz o app exibir o formulário da chave
  return error;
}

async function request(path, params = {}) {
  const key = getApiKey() || TMDB_API_KEY;
  if (!key) throw keyError('Informe sua chave da API do TMDB para começar.');

  const isToken = key.startsWith('eyJ'); // token v4 (Bearer) ou chave v3
  const url = new URL(`${BASE_URL}${path}`);
  url.search = new URLSearchParams({
    language: 'pt-BR',
    ...(isToken ? {} : { api_key: key }),
    ...params,
  });

  let response;
  try {
    response = await fetch(url, { headers: isToken ? { Authorization: `Bearer ${key}` } : {} });
  } catch {
    throw new Error('Sem conexão com o TMDB. Verifique sua internet e tente de novo.');
  }
  if (response.status === 401) throw keyError('Chave da API inválida. Confira e informe novamente.');
  if (!response.ok) throw new Error(`O TMDB respondeu com erro ${response.status}. Tente de novo em instantes.`);
  return response.json();
}

export const getGenres = async (type) => (await request(`/genre/${type}/list`)).genres;

export const searchTitles = (type, query, page = 1) =>
  request(`/search/${type}`, { query, page, include_adult: false });

export const discoverTitles = (type, genre, page = 1) =>
  request(`/discover/${type}`, {
    page,
    sort_by: 'popularity.desc',
    'vote_count.gte': 50,
    ...(genre ? { with_genres: genre } : {}),
  });

export const getDetails = (type, id) => request(`/${type}/${id}`);
