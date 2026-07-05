import { formatHourLabel, formatTemperature, getWeatherInfo } from '../utils/weather.js'

function HourlyForecast({ hours }) {
  return (
    <section className="panel hourly-forecast">
      <div className="section-header">
        <div>
          <p className="section-kicker">Today</p>
          <h2 className="section-title">Hourly forecast</h2>
        </div>
      </div>
      <div className="hourly-grid">
        {hours.map((hour) => {
          const weatherInfo = getWeatherInfo(hour.weatherCode)

          return (
            <article key={hour.time} className="hourly-card">
              <span className="hourly-card__time">{formatHourLabel(hour.time)}</span>
              <span className="hourly-card__symbol" aria-hidden="true">
                {weatherInfo.symbol}
              </span>
              <strong className="hourly-card__temp">{formatTemperature(hour.temperature)}</strong>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default HourlyForecast