function DestinationHighlights({ badges }) {
  if (!badges.length) {
    return null
  }

  return (
    <section className="destination-highlights">
      <div className="section-header">
        <div>
          <p className="section-kicker">Travel highlights</p>
          <h2 className="section-title">Quick trip cues</h2>
        </div>
      </div>
      <div className="badge-row">
        {badges.map((badge) => (
          <span key={badge} className="badge">
            {badge}
          </span>
        ))}
      </div>
    </section>
  )
}

export default DestinationHighlights