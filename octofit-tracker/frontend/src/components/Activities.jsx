import CollectionPage from './CollectionPage.jsx'
import { formatDate, formatReference, recordKey } from './formatters.js'

export default function Activities() {
  return (
    <CollectionPage
      title="Activities"
      description="Recent training sessions recorded across your tracker."
      resource="activities"
    >
      {(items) => (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr><th>Activity</th><th>Member</th><th>Date</th><th>Duration</th><th>Distance</th><th>Points</th></tr>
            </thead>
            <tbody>
              {items.map((activity, index) => (
                <tr key={recordKey(activity, index)}>
                  <td><span className="type-label">{activity.type || 'Activity'}</span></td>
                  <td className="cell-secondary">{formatReference(activity.userId)}</td>
                  <td>{formatDate(activity.date)}</td>
                  <td>{activity.durationMinutes ?? '-'} min</td>
                  <td>{activity.distanceKm == null ? '-' : `${activity.distanceKm} km`}</td>
                  <td className="cell-primary">{activity.points ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CollectionPage>
  )
}