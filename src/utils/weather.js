const WEATHER_CODES = {
  0: { label: 'Clear sky', symbol: '☀' },
  1: { label: 'Mainly clear', symbol: '🌤' },
  2: { label: 'Partly cloudy', symbol: '⛅' },
  3: { label: 'Cloudy', symbol: '☁' },
  45: { label: 'Fog', symbol: '🌫' },
  48: { label: 'Rime fog', symbol: '🌫' },
  51: { label: 'Light drizzle', symbol: '🌦' },
  53: { label: 'Drizzle', symbol: '🌦' },
  55: { label: 'Dense drizzle', symbol: '🌧' },
  56: { label: 'Freezing drizzle', symbol: '🌧' },
  57: { label: 'Freezing drizzle', symbol: '🌧' },
  61: { label: 'Slight rain', symbol: '🌦' },
  63: { label: 'Rain', symbol: '🌧' },
  65: { label: 'Heavy rain', symbol: '🌧' },
  66: { label: 'Freezing rain', symbol: '🌧' },
  67: { label: 'Freezing rain', symbol: '🌧' },
  71: { label: 'Slight snow', symbol: '🌨' },
  73: { label: 'Snow', symbol: '🌨' },
  75: { label: 'Heavy snow', symbol: '❄' },
  77: { label: 'Snow grains', symbol: '❄' },
  80: { label: 'Rain showers', symbol: '🌦' },
  81: { label: 'Rain showers', symbol: '🌧' },
  82: { label: 'Heavy showers', symbol: '⛈' },
  85: { label: 'Snow showers', symbol: '🌨' },
  86: { label: 'Snow showers', symbol: '❄' },
  95: { label: 'Thunderstorm', symbol: '⛈' },
  96: { label: 'Thunderstorm with hail', symbol: '⛈' },
  99: { label: 'Thunderstorm with hail', symbol: '⛈' },
  default: { label: 'Weather', symbol: '◌' },
}

export function getWeatherInfo(weatherCode) {
  return WEATHER_CODES[weatherCode] ?? WEATHER_CODES.default
}

export function formatTemperature(value) {
  return `${Math.round(value)}°`
}

export function formatTemperatureLabel(value) {
  return `${Math.round(value)}°C`
}

export function formatDateLabel(dateValue) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${dateValue}T12:00:00`))
}

export function formatHourLabel(timeValue) {
  return timeValue.slice(11, 16)
}

export function formatPopulation(value) {
  if (value === undefined || value === null) {
    return 'Unknown'
  }

  return new Intl.NumberFormat('en').format(value)
}

export function getCityDisplayName(city) {
  return [city.name, city.admin1, city.country].filter(Boolean).join(', ')
}

export function getCityKey(city) {
  return city.id ?? getCityDisplayName(city)
}

export function formatLocalDate(value, timeZone) {
  if (!value) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(new Date(value))
}

export function formatLocalTime(value, timeZone) {
  if (!value) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(new Date(value))
}

export function getDayName(value, timeZone) {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    timeZone,
  }).format(new Date(value))
}

export function getWeatherSummary(current) {
  const details = getWeatherInfo(current.weather_code)

  return {
    temperature: formatTemperature(current.temperature_2m),
    condition: details.label,
    symbol: details.symbol,
    feelsLike: formatTemperatureLabel(current.apparent_temperature),
  }
}

export function createCitySnapshot(city, current) {
  return {
    ...city,
    weatherSummary: getWeatherSummary(current),
  }
}

function getWeatherPenalty(weatherCode) {
  if ([95, 96, 99].includes(weatherCode)) {
    return { penalty: 35, label: 'thunderstorms' }
  }

  if ([63, 65, 80, 81, 82].includes(weatherCode)) {
    return { penalty: 24, label: 'rain' }
  }

  if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    return { penalty: 14, label: 'drizzle' }
  }

  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    return { penalty: 18, label: 'snow' }
  }

  return { penalty: 0, label: 'clear skies' }
}

export function getDailyForecastDays(forecast) {
  const daily = forecast.daily

  return daily.time.map((time, index) => ({
    time,
    weatherCode: daily.weather_code[index],
    temperatureMax: daily.temperature_2m_max[index],
    temperatureMin: daily.temperature_2m_min[index],
    sunrise: daily.sunrise?.[index],
    sunset: daily.sunset?.[index],
    windSpeedMax: daily.wind_speed_10m_max?.[index],
  }))
}

export function getForecastDayTitle(day, timeZone) {
  return getDayName(day.time, timeZone)
}

export function scoreForecastDay(day) {
  const weatherPenalty = getWeatherPenalty(day.weatherCode)
  let score = 100 - weatherPenalty.penalty
  const notes = []

  if (day.windSpeedMax >= 30) {
    score -= 20
    notes.push('strong winds')
  } else if (day.windSpeedMax >= 20) {
    score -= 10
    notes.push('moderate winds')
  } else {
    score += 10
    notes.push('light winds')
  }

  if (day.temperatureMax >= 34) {
    score -= 18
    notes.push('hot temperatures')
  } else if (day.temperatureMax >= 28) {
    score -= 8
    notes.push('warm temperatures')
  } else if (day.temperatureMax >= 18) {
    score += 12
    notes.push('pleasant temperatures')
  } else {
    score -= 8
    notes.push('cool weather')
  }

  if (day.temperatureMin <= 2) {
    score -= 12
    notes.push('cold mornings')
  }

  if (weatherPenalty.penalty === 0) {
    score += 8
  }

  return {
    score,
    notes,
    weatherLabel: getWeatherInfo(day.weatherCode).label,
    weatherSymbol: getWeatherInfo(day.weatherCode).symbol,
  }
}

export function getBestDayToVisit(days, timeZone) {
  const scoredDays = days.map((day) => {
    const scoreResult = scoreForecastDay(day)

    return {
      ...day,
      ...scoreResult,
      dayName: getForecastDayTitle(day, timeZone),
    }
  })

  const bestDay = scoredDays.reduce((currentBest, candidate) => (candidate.score > currentBest.score ? candidate : currentBest), scoredDays[0])

  if (!bestDay) {
    return null
  }

  return {
    day: bestDay,
    reason: `${bestDay.dayName} is the best day to visit because ${buildBestDayReason(bestDay)}.`,
  }
}

function buildBestDayReason(day) {
  const positiveDetails = []
  const hasRain = [63, 65, 80, 81, 82, 95, 96, 99].includes(day.weatherCode)

  if (day.temperatureMax >= 18 && day.temperatureMax <= 28) {
    positiveDetails.push('temperatures are pleasant')
  }

  if (day.windSpeedMax < 20) {
    positiveDetails.push('winds stay light')
  }

  if (!hasRain) {
    positiveDetails.push('there is little chance of rain')
  }

  if (positiveDetails.length === 0) {
    positiveDetails.push('it offers the most balanced weather in the forecast')
  }

  return positiveDetails.join(' and ')
}

export function getDestinationHighlights(forecast, bestDay) {
  const highlights = []
  const current = forecast.current
  const todaySunrise = forecast.daily.sunrise?.[0]
  const todaySunset = forecast.daily.sunset?.[0]
  const currentWeather = getWeatherInfo(current.weather_code)

  if (current.temperature_2m >= 18 && current.temperature_2m <= 28 && [0, 1, 2].includes(current.weather_code)) {
    highlights.push('Pleasant Weather')
  }

  if (todaySunrise) {
    highlights.push('Beautiful Sunrise')
  }

  if (todaySunset) {
    highlights.push('Late Sunset')
  }

  if (current.wind_speed_10m <= 18) {
    highlights.push('Light Winds')
  }

  if ([63, 65, 80, 81, 82, 95, 96, 99].includes(current.weather_code) || (bestDay?.day?.weatherCode && [63, 65, 80, 81, 82, 95, 96, 99].includes(bestDay.day.weatherCode))) {
    highlights.push('Carry Umbrella')
  }

  if (!highlights.length) {
    highlights.push(currentWeather.label)
  }

  return Array.from(new Set(highlights)).slice(0, 5)
}

export function getTripBadgeSummary(current) {
  return getWeatherSummary(current)
}

export function getHourlyForecast(forecast, limit = 12) {
  const times = forecast.hourly.time
  const temperatures = forecast.hourly.temperature_2m
  const weatherCodes = forecast.hourly.weather_code ?? []
  const currentIndex = times.findIndex((timeValue) => timeValue === forecast.current.time)
  const startIndex = currentIndex >= 0 ? currentIndex : 0

  return times.slice(startIndex, startIndex + limit).map((timeValue, index) => ({
    time: timeValue,
    temperature: temperatures[startIndex + index],
    weatherCode: weatherCodes[startIndex + index] ?? forecast.current.weather_code,
  }))
}