import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import octofitLogo from '../../../docs/octofitapp-small.png'

const sections = ['Activities', 'Teams', 'Leaderboard', 'Workouts']

function App() {
  const [apiStatus, setApiStatus] = useState('Checking')

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/health', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json()
      })
      .then((health: { status: string }) => setApiStatus(health.status === 'ok' ? 'Online' : 'Unavailable'))
      .catch(() => {
        if (!controller.signal.aborted) setApiStatus('Unavailable')
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="app-shell">
      <header className="navbar navbar-expand bg-white border-bottom">
        <div className="container-fluid app-container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-semibold" to="/">
            <img src={octofitLogo} alt="" width="36" height="36" />
            OctoFit Tracker
          </NavLink>
          <span className={`badge rounded-pill ${apiStatus === 'Online' ? 'text-bg-success' : 'text-bg-secondary'}`}>
            API {apiStatus}
          </span>
        </div>
      </header>
      <div className="container-fluid app-container py-4">
        <nav className="nav nav-pills app-nav mb-4" aria-label="Main navigation">
          <NavLink className="nav-link" to="/">Overview</NavLink>
          {sections.map((section) => (
            <NavLink className="nav-link" to={`/${section.toLowerCase()}`} key={section}>
              {section}
            </NavLink>
          ))}
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Overview />} />
            {sections.map((section) => (
              <Route key={section} path={`/${section.toLowerCase()}`} element={<Section title={section} />} />
            ))}
          </Routes>
        </main>
      </div>
    </div>
  )
}

function Overview() {
  return (
    <>
      <div className="mb-4">
        <p className="text-uppercase text-secondary small fw-semibold mb-2">Your training space</p>
        <h1 className="h2 mb-1">Overview</h1>
        <p className="text-secondary mb-0">Your activity, teams, and goals in one place.</p>
      </div>
      <div className="row g-3">
        {sections.map((section) => (
          <div className="col-12 col-sm-6 col-xl-3" key={section}>
            <NavLink to={`/${section.toLowerCase()}`} className="overview-link">
              <span className="small text-secondary">TRACKER</span>
              <span className="d-block fw-semibold mt-2">{section}</span>
            </NavLink>
          </div>
        ))}
      </div>
    </>
  )
}

function Section({ title }: { title: string }) {
  return (
    <div>
      <p className="text-uppercase text-secondary small fw-semibold mb-2">OctoFit Tracker</p>
      <h1 className="h2 mb-2">{title}</h1>
      <p className="text-secondary">No {title.toLowerCase()} to show yet.</p>
    </div>
  )
}

export default App
