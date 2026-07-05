function Loader() {
  return (
    <div className="loader-layout" aria-label="Loading weather data" aria-busy="true">
      <div className="panel loader-card loader-card--large">
        <div className="skeleton skeleton--line skeleton--wide" />
        <div className="skeleton skeleton--line skeleton--medium" />
        <div className="loader-card__stats">
          <div className="skeleton skeleton--block" />
          <div className="skeleton skeleton--block" />
          <div className="skeleton skeleton--block" />
        </div>
      </div>
      <div className="panel loader-card">
        <div className="skeleton skeleton--line skeleton--medium" />
        <div className="loader-card__grid">
          <div className="skeleton skeleton--mini" />
          <div className="skeleton skeleton--mini" />
          <div className="skeleton skeleton--mini" />
          <div className="skeleton skeleton--mini" />
        </div>
      </div>
    </div>
  )
}

export default Loader