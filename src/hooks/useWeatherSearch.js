import { useCallback, useState } from 'react'
import { getForecast, searchCities } from '../services/openMeteo.js'

export function useWeatherSearch() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [weather, setWeather] = useState(null)

  const loadWeather = useCallback(async (city) => {
    const forecast = await getForecast(city.latitude, city.longitude)
    setWeather({ city, forecast })
    setQuery(city.name)
    return forecast
  }, [])

  const searchCity = useCallback(
    async (rawQuery) => {
      const trimmedQuery = rawQuery.trim()
      setQuery(rawQuery)
      setError('')
      setSuggestions([])

      if (!trimmedQuery) {
        setWeather(null)
        setError('Please enter a city name.')
        return { type: 'empty' }
      }

      setLoading(true)

      try {
        const results = await searchCities(trimmedQuery)

        if (!results.length) {
          setWeather(null)
          setError('City not found.')
          return { type: 'not-found' }
        }

        if (results.length === 1) {
          await loadWeather(results[0])
          return { type: 'loaded', city: results[0] }
        }

        setSuggestions(results)
        return { type: 'multiple', results }
      } catch (searchError) {
        setWeather(null)
        setError(searchError.message || 'Unable to load weather data.')
        return { type: 'error' }
      } finally {
        setLoading(false)
      }
    },
    [loadWeather],
  )

  const selectCity = useCallback(
    async (city) => {
      setLoading(true)
      setError('')
      setSuggestions([])

      try {
        await loadWeather(city)
        return { type: 'loaded', city }
      } catch (selectError) {
        setWeather(null)
        setError(selectError.message || 'Unable to load weather data.')
        return { type: 'error' }
      } finally {
        setLoading(false)
      }
    },
    [loadWeather],
  )

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])

  const clearError = useCallback(() => {
    setError('')
  }, [])

  return {
    query,
    setQuery,
    loading,
    error,
    setError,
    clearError,
    suggestions,
    weather,
    searchCity,
    selectCity,
    clearSuggestions,
  }
}