import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteCities from '../components/FavoriteCities.jsx'
import { readFavoriteCities, removeCity, writeFavoriteCities } from '../utils/storage.js'

function Favorites() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState(() => readFavoriteCities())

  const handleSelectCity = (city) => {
    navigate(`/?city=${encodeURIComponent(city.name)}`)
  }

  const handleRemoveCity = (city) => {
    setFavorites((current) => {
      const nextFavorites = removeCity(current, city)
      writeFavoriteCities(nextFavorites)
      return nextFavorites
    })
  }

  return (
    <section className="page container">
      <div className="page-heading">
        <p className="section-kicker">Saved trips</p>
        <h1>My Trips</h1>
        <p>All trips are stored locally in your browser.</p>
      </div>
      <FavoriteCities
        title="My Trips"
        cities={favorites}
        onSelectCity={handleSelectCity}
        onRemoveCity={handleRemoveCity}
        emptyTitle="You do not have any saved trips yet"
        emptyDescription="Save a destination from the Home page to create a shortlist of places you want to revisit."
        emptyActionLabel="Explore destinations"
        emptyActionHref="/"
      />
    </section>
  )
}

export default Favorites