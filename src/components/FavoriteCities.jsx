import EmptyState from './EmptyState.jsx'
import { getCityKey } from '../utils/weather.js'

function FavoriteCities({ title, cities, onSelectCity, onRemoveCity, emptyTitle, emptyDescription, emptyActionLabel, emptyActionHref }) {
  if (!cities.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} actionLabel={emptyActionLabel} actionHref={emptyActionHref} />
  }

  return (
    <section className="favorite-cities panel">
      <div className="section-header">
        <div>
          <p className="section-kicker">Saved places</p>
          <h2 className="section-title">{title}</h2>
        </div>
      </div>
      <div className="favorite-grid">
        {cities.map((city) => (
          <article key={getCityKey(city)} className="favorite-card">
            <div>
              <div className="favorite-card__heading">
                <div className="favorite-card__symbol">{city.weatherSummary?.symbol || '✦'}</div>
                <div>
                  <h3>{city.name}</h3>
                  <p>{[city.admin1, city.country].filter(Boolean).join(', ') || 'Saved location'}</p>
                </div>
              </div>
              <span className="favorite-card__weather">{city.weatherSummary ? `${city.weatherSummary.temperature} · ${city.weatherSummary.condition}` : 'Saving weather snapshot for this trip...'}</span>
            </div>
            <div className="favorite-card__actions">
              {onSelectCity ? (
                <button type="button" className="button-secondary" onClick={() => onSelectCity(city)}>
                  View weather
                </button>
              ) : null}
              {onRemoveCity ? (
                <button type="button" className="button-secondary button-secondary--danger" onClick={() => onRemoveCity(city)}>
                  Remove
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FavoriteCities