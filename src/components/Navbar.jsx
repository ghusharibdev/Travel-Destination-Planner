import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

function Navbar({ theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" to="/">
          Travel Weather Explorer
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'site-nav__link is-active' : 'site-nav__link')}>
            Home
          </NavLink>
          <NavLink to="/trips" className={({ isActive }) => (isActive ? 'site-nav__link is-active' : 'site-nav__link')}>
            My Trips
          </NavLink>
        </nav>
        <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
      </div>
    </header>
  )
}

export default Navbar