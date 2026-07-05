import ForecastCard from './ForecastCard.jsx'

function ForecastGrid({ days, selectedDay, onSelectDay }) {
  return (
    <section className="forecast-section">
      <div className="section-header">
        <div>
          <p className="section-kicker">7-day forecast</p>
          <h2 className="section-title">Daily outlook</h2>
        </div>
      </div>
      <div className="forecast-grid">
        {days.map((day) => (
          <ForecastCard key={day.time} day={day} isSelected={selectedDay === day.time} onSelect={onSelectDay} />
        ))}
      </div>
    </section>
  )
}

export default ForecastGrid