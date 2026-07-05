import { Link } from 'react-router-dom'

function EmptyState({ title, description, actionLabel, actionHref, onAction }) {
  return (
    <div className="panel message-card message-card--empty">
      <div>
        <p className="section-kicker">Start here</p>
        <h2 className="section-title">{title}</h2>
        <p className="message-card__text">{description}</p>
      </div>
      {actionLabel ? (
        actionHref ? (
          <Link className="button-primary" to={actionHref}>
            {actionLabel}
          </Link>
        ) : (
          <button type="button" className="button-primary" onClick={onAction}>
            {actionLabel}
          </button>
        )
      ) : null}
    </div>
  )
}

export default EmptyState