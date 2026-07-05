function ThemeToggle({ theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

export default ThemeToggle