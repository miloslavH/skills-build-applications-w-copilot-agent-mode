import CollectionPage from './CollectionPage.jsx'
import { recordKey } from './formatters.js'

export default function Users() {
  return (
    <CollectionPage
      title="Users"
      description="Members with profiles in the OctoFit tracker."
      resource="users"
    >
      {(items) => (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>Name</th><th>Username</th><th>Email</th></tr>
            </thead>
            <tbody>
              {items.map((user, index) => (
                <tr key={recordKey(user, index)}>
                  <td className="cell-primary">{user.displayName || user.username || 'Unnamed member'}</td>
                  <td className="cell-secondary">{user.username ? `@${user.username}` : '-'}</td>
                  <td>{user.email || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CollectionPage>
  )
}