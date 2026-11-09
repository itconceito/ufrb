/**
 * storage.js: tudo que envolve LocalStorage (favoritos e chave da API).
 */
const KEYS = { favorites: 'claquete:favoritos', apiKey: 'claquete:tmdb-key' };

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback; // JSON corrompido ou storage bloqueado
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn('Não foi possível salvar no LocalStorage:', error);
    return false;
  }
}

export const getApiKey = () => read(KEYS.apiKey, '');
export const setApiKey = (key) => write(KEYS.apiKey, key);

export const getFavorites = () => read(KEYS.favorites, []);

export const isFavorite = (id, type) =>
  getFavorites().some((fav) => fav.id === id && fav.type === type);

/** Adiciona ou remove o título. Retorna true se ele passou a ser favorito. */
export function toggleFavorite(item) {
  const favorites = getFavorites();
  const index = favorites.findIndex((fav) => fav.id === item.id && fav.type === item.type);
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    const { id, type, title, poster, rating, year } = item;
    favorites.unshift({ id, type, title, poster, rating, year });
  }
  write(KEYS.favorites, favorites);
  return index < 0;
}
