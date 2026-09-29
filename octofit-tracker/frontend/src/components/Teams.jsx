import CollectionPage from './CollectionPage.jsx'
import { recordKey } from './formatters.js'

export default function Teams() {
  return (
    <CollectionPage
      title="Teams"
      description="Training crews, their members, and their combined points."
      resource="teams"
    >
      {(items) => (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>Team</th><th>Description</th><th>Members</th><th>Points</th></tr>
            </thead>
            <tbody>
              {items.map((team, index) => (
                <tr key={recordKey(team, index)}>
                  <td className="cell-primary">{team.name || 'Unnamed team'}</td>
                  <td className="cell-secondary">{team.description || '-'}</td>
                  <td>{Array.isArray(team.members) ? team.members.length : '-'}</td>
                  <td className="cell-primary">{team.points ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CollectionPage>
  )
}