import { formatLocalDate, formatLocalTime } from '../utils/weather.js'

function DestinationOverview({ city, timezone, currentTime }) {
  return (
    <section className="panel info-card">
      <div className="section-header">
        <div>
          <p className="section-kicker">Destination overview</p>
          <h2 className="section-title">Plan your trip</h2>
        </div>
      </div>
      <dl className="info-grid">
        <div>
          <dt>Country</dt>
          <dd>{city.country || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Region</dt>
          <dd>{city.admin1 || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Population</dt>
          <dd>{city.population ? new Intl.NumberFormat('en').format(city.population) : 'Unknown'}</dd>
        </div>
        <div>
          <dt>Timezone</dt>
          <dd>{timezone || city.timezone || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Latitude</dt>
          <dd>{city.latitude?.toFixed(2) || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Longitude</dt>
          <dd>{city.longitude?.toFixed(2) || 'Unknown'}</dd>
        </div>
        <div>
          <dt>Local date</dt>
          <dd>{formatLocalDate(currentTime, timezone || city.timezone)}</dd>
        </div>
        <div>
          <dt>Local time</dt>
          <dd>{formatLocalTime(currentTime, timezone || city.timezone)}</dd>
        </div>
      </dl>
    </section>
  )
}

export default DestinationOverview