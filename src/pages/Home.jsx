import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CityInfo from '../components/CityInfo.jsx'
import BestDayToVisit from '../components/BestDayToVisit.jsx'
import CurrentWeatherCard from '../components/CurrentWeatherCard.jsx'
import DestinationHighlights from '../components/DestinationHighlights.jsx'
import DestinationOverview from '../components/DestinationOverview.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import FavoriteCities from '../components/FavoriteCities.jsx'
import ForecastGrid from '../components/ForecastGrid.jsx'
import HourlyForecast from '../components/HourlyForecast.jsx'
import SunriseSunset from '../components/SunriseSunset.jsx'
import Loader from '../components/Loader.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { useWeatherSearch } from '../hooks/useWeatherSearch.js'
import {
  addRecentSearch,
  hasCity,
  readFavoriteCities,
  readRecentSearches,
  removeCity,
  upsertCity,
  writeFavoriteCities,
  writeRecentSearches,
} from '../utils/storage.js'
import { createCitySnapshot, getBestDayToVisit, getDailyForecastDays, getDestinationHighlights, getHourlyForecast, getWeatherInfo } from '../utils/weather.js'

function Home() {
  const location = useLocation()
  const autoSearchRef = useRef('')
  const [favorites, setFavorites] = useState(() => readFavoriteCities())
  const [recentSearches, setRecentSearches] = useState(() => readRecentSearches())
  const [selectedDay, setSelectedDay] = useState('')
  const { query, setQuery, loading, error, weather, suggestions, searchCity, selectCity, clearSuggestions, clearError } = useWeatherSearch()

  useEffect(() => {
    writeFavoriteCities(favorites)
  }, [favorites])

  useEffect(() => {
    writeRecentSearches(recentSearches)
  }, [recentSearches])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const cityName = searchParams.get('city')?.trim()

    if (!cityName || autoSearchRef.current === cityName) {
      return
    }

    autoSearchRef.current = cityName
    setQuery(cityName)
    void searchCity(cityName)
  }, [location.search, searchCity, setQuery])

  useEffect(() => {
    if (!weather?.city) {
      return
    }

    const citySnapshot = createCitySnapshot(weather.city, weather.forecast.current)

    setRecentSearches((current) => addRecentSearch(current, citySnapshot))
    setFavorites((current) => (hasCity(current, weather.city) ? upsertCity(current, citySnapshot, 8) : current))
  }, [weather])

  const dailyItems = useMemo(() => {
    if (!weather?.forecast?.daily) {
      return []
    }

    return getDailyForecastDays(weather.forecast)
  }, [weather])

  const bestDayInfo = useMemo(() => {
    if (!weather?.forecast?.timezone || !dailyItems.length) {
      return null
    }

    return getBestDayToVisit(dailyItems, weather.forecast.timezone)
  }, [dailyItems, weather])

  useEffect(() => {
    if (!dailyItems.length) {
      setSelectedDay('')
      return
    }

    setSelectedDay(bestDayInfo?.day?.time || dailyItems[0].time)
  }, [bestDayInfo, dailyItems])

  const currentWeatherInfo = useMemo(() => {
    if (!weather?.forecast?.current) {
      return null
    }

    return getWeatherInfo(weather.forecast.current.weather_code)
  }, [weather])

  const hourlyItems = useMemo(() => {
    if (!weather?.forecast) {
      return []
    }

    return getHourlyForecast(weather.forecast)
  }, [weather])

  const destinationHighlights = useMemo(() => {
    if (!weather?.forecast) {
      return []
    }

    return getDestinationHighlights(weather.forecast, bestDayInfo)
  }, [bestDayInfo, weather])

  const selectedDayData = dailyItems.find((day) => day.time === selectedDay) || dailyItems[0]

  const handleSearch = async (event) => {
    event.preventDefault()
    await searchCity(query)
  }

  const handleQueryChange = (value) => {
    setQuery(value)
    clearSuggestions()
    clearError()
  }

  const handleSelectCity = async (city) => {
    await selectCity(city)
  }

  const handleRetry = async () => {
    await searchCity(query)
  }

  const handleToggleFavorite = (city) => {
    setFavorites((current) => {
      const tripSnapshot = weather?.city && hasCity([weather.city], city)
        ? createCitySnapshot(weather.city, weather.forecast.current)
        : city

      if (hasCity(current, city)) {
        return removeCity(current, city)
      }

      return upsertCity(current, tripSnapshot, 8)
    })
  }

  const handleRecentSelect = async (city) => {
    setQuery(city.name)
    await searchCity(city.name)
  }

  const handleSelectDay = (dayTime) => {
    setSelectedDay(dayTime)
  }

  useEffect(() => {
    if (!weather?.city) {
      return
    }

    const tripSnapshot = createCitySnapshot(weather.city, weather.forecast.current)

    setFavorites((current) => (hasCity(current, weather.city) ? upsertCity(current, tripSnapshot, 8) : current))
  }, [weather])

  const isFavorite = weather?.city ? hasCity(favorites, weather.city) : false

  return (
    <section className="page home-page container">
      <div className="hero-shell">
        <div className="hero__copy">
          <h1>Travel Destination Explorer</h1>
          <p>Plan your next trip by comparing the weather, the daylight, and the best day to go.</p>
        </div>
        <SearchBar value={query} onChange={handleQueryChange} onSubmit={handleSearch} disabled={loading} suggestions={suggestions} onSelectSuggestion={handleSelectCity} onClearSuggestions={clearSuggestions} />
      </div>

      {error ? <ErrorMessage message={error} actionLabel="Try again" onAction={handleRetry} /> : null}

      {!weather && !loading && !error ? (
        <EmptyState title="Search for any destination and start planning your next trip." description="Use the search box to compare current conditions, daylight, and the seven-day outlook." />
      ) : null}

      {loading ? <Loader /> : null}

      {weather?.city && weather?.forecast ? (
        <div className="destination-layout">
          <CurrentWeatherCard city={weather.city} current={weather.forecast.current} weatherInfo={currentWeatherInfo} isFavorite={isFavorite} onToggleFavorite={handleToggleFavorite} />
          <DestinationHighlights badges={destinationHighlights} />
          <div className="destination-grid">
            <DestinationOverview city={weather.city} timezone={weather.forecast.timezone} currentTime={weather.forecast.current.time} />
            <SunriseSunset sunrise={selectedDayData?.sunrise || weather.forecast.daily.sunrise?.[0]} sunset={selectedDayData?.sunset || weather.forecast.daily.sunset?.[0]} timezone={weather.forecast.timezone} />
          </div>
          <div className="destination-grid destination-grid--bottom">
            <BestDayToVisit bestDay={bestDayInfo?.day ? { ...bestDayInfo.day } : null} />
            <CityInfo city={weather.city} timezone={weather.forecast.timezone} />
          </div>
          <HourlyForecast hours={hourlyItems} />
          <ForecastGrid days={dailyItems} selectedDay={selectedDay} onSelectDay={handleSelectDay} />
        </div>
      ) : null}

      <div className="home-grid">
        <section className="panel home-section">
          <div className="section-header">
            <div>
              <p className="section-kicker">Quick access</p>
              <h2 className="section-title">Recent searches</h2>
            </div>
          </div>
          {recentSearches.length ? (
            <div className="chip-list">
              {recentSearches.map((city) => (
                <button key={city.id ?? city.name} type="button" className="chip recent-chip" onClick={() => handleRecentSelect(city)}>
                  <span className="recent-chip__name">{city.name}</span>
                  <span className="recent-chip__meta">
                    {city.weatherSummary ? `${city.weatherSummary.temperature} · ${city.weatherSummary.condition}` : [city.admin1, city.country].filter(Boolean).join(', ') || 'Recent search'}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="muted-text">Your latest destinations will appear here.</p>
          )}
        </section>

        <FavoriteCities
          title="My Trips"
          cities={favorites}
          onSelectCity={handleRecentSelect}
          onRemoveCity={(city) => setFavorites((current) => removeCity(current, city))}
          emptyTitle="No trips yet"
          emptyDescription="Save a destination from the hero card and it will show up here."
          emptyActionLabel="Open My Trips"
          emptyActionHref="/trips"
        />
      </div>
    </section>
  )
}

export default Home