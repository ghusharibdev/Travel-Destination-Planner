import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import Favorites from './pages/Favorites.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import { applyStoredTheme, readStoredTheme, writeStoredTheme } from './utils/storage.js'

function App() {
  const [theme, setTheme] = useState(() => readStoredTheme())

  useEffect(() => {
    applyStoredTheme(theme)
    writeStoredTheme(theme)
  }, [theme])

  const handleThemeToggle = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar theme={theme} onToggleTheme={handleThemeToggle} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<Favorites />} />
            <Route path="/favorites" element={<Navigate to="/trips" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
