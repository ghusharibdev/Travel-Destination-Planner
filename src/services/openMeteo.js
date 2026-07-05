async function requestJson(url, errorMessage) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(errorMessage)
  }

  return response.json()
}

export async function searchCities(name) {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search')
  url.searchParams.set('name', name)
  url.searchParams.set('count', '10')
  url.searchParams.set('language', 'en')
  url.searchParams.set('format', 'json')

  const data = await requestJson(url, 'Unable to search for cities.')
  return Array.isArray(data.results) ? data.results : []
}

export async function getForecast(latitude, longitude) {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', latitude)
  url.searchParams.set('longitude', longitude)
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code')
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,wind_speed_10m_max')
  url.searchParams.set('hourly', 'temperature_2m,weather_code')
  url.searchParams.set('forecast_days', '7')

  const data = await requestJson(url, 'Unable to load weather forecast.')

  if (!data.current || !data.daily || !data.hourly) {
    throw new Error('Weather data is incomplete.')
  }

  return data
}