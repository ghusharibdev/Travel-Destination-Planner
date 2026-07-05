import { useEffect, useRef, useState } from 'react'
import SearchSuggestions from './SearchSuggestions.jsx'

function SearchBar({ value, onChange, onSubmit, disabled, suggestions, onSelectSuggestion, onClearSuggestions }) {
  const searchBarRef = useRef(null)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)

  useEffect(() => {
    setIsSuggestionsOpen(suggestions.length > 0)
  }, [suggestions])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!searchBarRef.current?.contains(event.target)) {
        setIsSuggestionsOpen(false)
        onClearSuggestions()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [onClearSuggestions])

  const handleSubmit = (event) => {
    setIsSuggestionsOpen(false)
    onSubmit(event)
  }

  const handleSelectCity = (city) => {
    setIsSuggestionsOpen(false)
    onSelectSuggestion(city)
  }

  return (
    <form ref={searchBarRef} className="search-bar panel" onSubmit={handleSubmit}>
      <div className="search-bar__field">
        <label className="sr-only" htmlFor="city-search">
          Search city
        </label>
        <input
          id="city-search"
          className="search-input"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search a city, region, or country"
          autoComplete="off"
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsSuggestionsOpen(true)
            }
          }}
        />
        <button className="button-primary" type="submit" disabled={disabled || !value.trim()}>
          Search
        </button>
      </div>
      <div className="search-bar__popover">
        {isSuggestionsOpen ? <SearchSuggestions cities={suggestions} onSelectCity={handleSelectCity} /> : null}
      </div>
    </form>
  )
}

export default SearchBar