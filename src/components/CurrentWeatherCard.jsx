import { formatLocalDate, formatLocalTime, formatTemperature, formatTemperatureLabel, getWeatherInfo } from '../utils/weather.js'

function CurrentWeatherCard({ city, current, weatherInfo, isFavorite, onToggleFavorite }) {
  const details = weatherInfo || getWeatherInfo(current.weather_code)

  return (
    <section className="panel hero-destination-card">
      <div className="hero-destination-card__top">
        <div>
          <p className="section-kicker">Destination</p>
          <h1 className="hero-destination-card__title">{city.name}</h1>
          <p className="hero-destination-card__subtitle">{[city.admin1, city.country].filter(Boolean).join(', ')}</p>
        </div>
        <button type="button" className="favorite-toggle" onClick={() => onToggleFavorite(city)}>
          {isFavorite ? 'Trip saved' : 'Save Trip'}
        </button>
      </div>
      <div className="hero-destination-card__body">
        <div className="hero-destination-card__visual" aria-hidden="true">
          <span className="weather-symbol">{details.symbol}</span>
        </div>
        <div className="hero-destination-card__content">
          <p className="hero-destination-card__temperature">{formatTemperature(current.temperature_2m)}</p>
          <p className="hero-destination-card__condition">{details.label}</p>
          <div className="hero-destination-card__meta">
            <span>Feels like {formatTemperatureLabel(current.apparent_temperature)}</span>
            <span>{formatLocalDate(current.time, city.timezone)}</span>
            <span>{formatLocalTime(current.time, city.timezone)}</span>
          </div>
        </div>
      </div>
      <div className="hero-destination-card__metrics">
        <div className="metric-card">
          <span className="metric-card__label">Humidity</span>
          <strong className="metric-card__value">{current.relative_humidity_2m}%</strong>
        </div>
        <div className="metric-card">
          <span className="metric-card__label">Wind</span>
          <strong className="metric-card__value">{current.wind_speed_10m} km/h</strong>
        </div>
        <div className="metric-card">
          <span className="metric-card__label">Precipitation</span>
          <strong className="metric-card__value">{current.precipitation} mm</strong>
        </div>
      </div>
    </section>
  )
}

export default CurrentWeatherCard