function BestDayToVisit({ bestDay }) {
  if (!bestDay) {
    return null
  }

  return (
    <section className="panel info-card">
      <div className="section-header">
        <div>
          <p className="section-kicker">Best day to visit</p>
          <h2 className="section-title">Choose the easiest travel day</h2>
        </div>
      </div>
      <div className="best-day-card">
        <div className="best-day-card__summary">
          <strong>{bestDay.dayName}</strong>
          <span>{bestDay.temperatureMin}° - {bestDay.temperatureMax}°</span>
          <span>{bestDay.weatherLabel}</span>
        </div>
        <p>{bestDay.reason}</p>
      </div>
    </section>
  )
}

export default BestDayToVisit