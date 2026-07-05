import { formatDateLabel, formatTemperature, getWeatherInfo } from '../utils/weather.js'

function ForecastCard({ day, isSelected, onSelect }) {
  const weatherInfo = getWeatherInfo(day.weather_code)

  return (
    <button type="button" className={isSelected ? 'forecast-card panel forecast-card--selected' : 'forecast-card panel'} onClick={() => onSelect(day.time)}>
      <p className="forecast-card__day">{formatDateLabel(day.time)}</p>
      <span className="forecast-card__symbol" aria-hidden="true">
        {weatherInfo.symbol}
      </span>
      <p className="forecast-card__label">{weatherInfo.label}</p>
      <div className="forecast-card__temps">
        <strong>{formatTemperature(day.temperature_2m_max)}</strong>
        <span>{formatTemperature(day.temperature_2m_min)}</span>
      </div>
    </button>
  )
}

export default ForecastCard