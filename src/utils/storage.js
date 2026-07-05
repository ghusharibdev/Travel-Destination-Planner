const THEME_KEY = 'travel-weather-theme'
const RECENT_KEY = 'travel-weather-recent-searches'
const FAVORITES_KEY = 'travel-weather-favorite-cities'

function readJson(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue
  }

  try {
    const storedValue = window.localStorage.getItem(key)

    if (!storedValue) {
      return fallbackValue
    }

    return JSON.parse(storedValue)
  } catch {
    return fallbackValue
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function readStoredTheme() {
  const storedTheme = readJson(THEME_KEY, null)

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

export function writeStoredTheme(theme) {
  writeJson(THEME_KEY, theme)
}

export function applyStoredTheme(theme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

function getCityKey(city) {
  return city.id ?? [city.name, city.admin1, city.country].filter(Boolean).join('|')
}

function dedupeCities(cities) {
  const seen = new Set()

  return cities.filter((city) => {
    const key = getCityKey(city)

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

export function hasCity(cities, city) {
  const cityKey = getCityKey(city)
  return cities.some((item) => getCityKey(item) === cityKey)
}

export function upsertCity(cities, city, limit = 6) {
  const cityKey = getCityKey(city)
  const nextCities = [city, ...cities.filter((item) => getCityKey(item) !== cityKey)]
  return dedupeCities(nextCities).slice(0, limit)
}

export function removeCity(cities, city) {
  const cityKey = getCityKey(city)
  return cities.filter((item) => getCityKey(item) !== cityKey)
}

export function addRecentSearch(cities, city) {
  return upsertCity(cities, city, 8)
}

export function readRecentSearches() {
  const storedCities = readJson(RECENT_KEY, [])
  return Array.isArray(storedCities) ? storedCities : []
}

export function writeRecentSearches(cities) {
  writeJson(RECENT_KEY, cities)
}

export function readFavoriteCities() {
  const storedCities = readJson(FAVORITES_KEY, [])
  return Array.isArray(storedCities) ? storedCities : []
}

export function writeFavoriteCities(cities) {
  writeJson(FAVORITES_KEY, cities)
}

export { getCityKey }