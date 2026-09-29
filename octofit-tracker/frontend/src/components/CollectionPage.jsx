import { useCollection } from './useCollection.js'

export default function CollectionPage({ title, description, endpoint, children }) {
  const { items, loading, error } = useCollection(endpoint)

  return (
    <section>
      <div className="page-eyebrow">OctoFit / {title}</div>
      <header className="page-heading d-flex flex-wrap align-items-end justify-content-between gap-3">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <span className="record-count small">
          {loading ? 'Loading' : `${items.length} ${items.length === 1 ? 'record' : 'records'}`}
        </span>
      </header>
      <div className="collection-surface">
        {loading ? (
          <div className="collection-message" role="status">Loading {title.toLowerCase()}...</div>
        ) : error ? (
          <div className="collection-message" role="alert">
            <h2>Could not load {title.toLowerCase()}</h2>
            <p className="mb-0">{error}. Check the API configuration and try again.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="collection-message">
            <h2>No {title.toLowerCase()} yet</h2>
            <p className="mb-0">New entries will appear here.</p>
          </div>
        ) : (
          children(items)
        )}
      </div>
    </section>
  )
}