import CollectionPage from './CollectionPage.jsx'
import { recordKey } from './formatters.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

export default function Workouts() {
  return (
    <CollectionPage
      title="Workouts"
      description="Suggested sessions to help keep your training moving."
      endpoint={endpoint}
    >
      {(items) => (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>Workout</th><th>Type</th><th>Level</th><th>Duration</th><th>Description</th></tr>
            </thead>
            <tbody>
              {items.map((workout, index) => (
                <tr key={recordKey(workout, index)}>
                  <td className="cell-primary">{workout.title || 'Untitled workout'}</td>
                  <td><span className="type-label">{workout.activityType || 'General'}</span></td>
                  <td className="cell-secondary">{workout.level || '-'}</td>
                  <td>{workout.durationMinutes ?? '-'} min</td>
                  <td className="cell-secondary">{workout.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CollectionPage>
  )
}