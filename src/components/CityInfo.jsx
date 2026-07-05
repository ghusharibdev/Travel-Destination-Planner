import { formatPopulation, getCityDisplayName } from '../utils/weather.js'

function CityInfo({ city, timezone }) {
  return (
    <section className="panel city-info">
      <div className="section-header">
        <div>
          <p className="section-kicker">City information</p>
          <h2 className="section-title">{city.name}</h2>
        </div>
      </div>
      <dl className="city-info__list">
        <div className="city-info__item">
          <dt>Country</dt>
          <dd>{city.country || 'Unknown'}</dd>
        </div>
        <div className="city-info__item">
          <dt>Region</dt>
          <dd>{city.admin1 || 'Unknown'}</dd>
        </div>
        <div className="city-info__item">
          <dt>Timezone</dt>
          <dd>{timezone || city.timezone || 'Unknown'}</dd>
        </div>
        <div className="city-info__item">
          <dt>Population</dt>
          <dd>{formatPopulation(city.population)}</dd>
        </div>
      </dl>
      <p className="city-info__location">{getCityDisplayName(city)}</p>
    </section>
  )
}

export default CityInfo