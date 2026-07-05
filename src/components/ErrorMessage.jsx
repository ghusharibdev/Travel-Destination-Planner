function ErrorMessage({ title = 'Unable to load weather', message, actionLabel, onAction }) {
  return (
    <div className="panel message-card message-card--error" role="alert">
      <div>
        <p className="section-kicker">Error</p>
        <h2 className="section-title">{title}</h2>
        <p className="message-card__text">{message}</p>
      </div>
      {actionLabel ? (
        <button type="button" className="button-primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default ErrorMessage