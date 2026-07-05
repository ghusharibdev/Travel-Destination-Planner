import { formatLocalTime } from '../utils/weather.js'

function SunriseSunset({ sunrise, sunset, timezone }) {
  return (
    <section className="panel info-card">
      <div className="section-header">
        <div>
          <p className="section-kicker">Sunrise & sunset</p>
          <h2 className="section-title">Today&apos;s daylight</h2>
        </div>
      </div>
      <div className="sun-card-grid">
        <div className="sun-card">
          <span className="sun-card__label">Sunrise</span>
          <strong className="sun-card__value">{formatLocalTime(sunrise, timezone)}</strong>
        </div>
        <div className="sun-card">
          <span className="sun-card__label">Sunset</span>
          <strong className="sun-card__value">{formatLocalTime(sunset, timezone)}</strong>
        </div>
      </div>
    </section>
  )
}

export default SunriseSunset