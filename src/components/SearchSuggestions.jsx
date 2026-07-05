import { getCityDisplayName } from '../utils/weather.js'

function SearchSuggestions({ cities, onSelectCity }) {
  if (!cities.length) {
    return null
  }

  return (
    <div className="search-suggestions panel" role="listbox" aria-label="City suggestions">
      <p className="search-suggestions__title">Choose a city</p>
      <div className="search-suggestions__list">
        {cities.map((city) => (
          <button key={city.id ?? getCityDisplayName(city)} type="button" className="search-suggestions__item" onClick={() => onSelectCity(city)}>
            <span className="search-suggestions__name">{getCityDisplayName(city)}</span>
            <span className="search-suggestions__meta">{city.population ? `${new Intl.NumberFormat('en').format(city.population)} people` : city.timezone || 'Location'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchSuggestions