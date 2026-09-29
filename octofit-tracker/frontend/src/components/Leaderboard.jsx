import CollectionPage from './CollectionPage.jsx'
import { formatReference, recordKey } from './formatters.js'

export default function Leaderboard() {
  return (
    <CollectionPage
      title="Leaderboard"
      description="Compare member and team scores for each scoring period."
      resource="leaderboard"
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