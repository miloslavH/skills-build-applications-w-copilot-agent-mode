import CollectionPage from './CollectionPage.jsx'
import { formatReference, recordKey } from './formatters.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

export default function Leaderboard() {
  return (
    <CollectionPage
      title="Leaderboard"
      description="Compare member and team scores for each scoring period."
      endpoint={endpoint}
    >
      {(items) => (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>Rank</th><th>Competitor</th><th>Period</th><th>Score</th></tr>
            </thead>
            <tbody>
              {items.map((entry, index) => {
                const competitor = entry.teamId ? `Team: ${formatReference(entry.teamId)}` : formatReference(entry.userId)
                return (
                  <tr key={recordKey(entry, index)}>
                    <td className="cell-primary">#{entry.rank ?? '-'}</td>
                    <td>{competitor}</td>
                    <td className="cell-secondary">{entry.period || '-'}</td>
                    <td className="cell-primary">{entry.score ?? 0}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </CollectionPage>
  )
}