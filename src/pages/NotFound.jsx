import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page container not-found-page">
      <div className="panel message-card message-card--empty">
        <div>
          <p className="section-kicker">404</p>
          <h1 className="section-title">Page not found</h1>
          <p className="message-card__text">The page you are looking for does not exist.</p>
        </div>
        <Link className="button-primary" to="/">
          Go home
        </Link>
      </div>
    </section>
  )
}

export default NotFound