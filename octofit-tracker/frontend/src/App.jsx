import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { API_BASE_URL, requestApi } from './api.js'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import octofitLogo from '../../../docs/octofitapp-small.png'

const sections = [
  { label: 'Activities', path: 'activities', Component: Activities },
  { label: 'Teams', path: 'teams', Component: Teams },
  { label: 'Leaderboard', path: 'leaderboard', Component: Leaderboard },
  { label: 'Users', path: 'users', Component: Users },
  { label: 'Workouts', path: 'workouts', Component: Workouts },
]

function App() {
  const [apiStatus, setApiStatus] = useState('Checking')

  useEffect(() => {
    const controller = new AbortController()

    requestApi('/api/health', { signal: controller.signal })
      .then((health) => setApiStatus(health.status === 'ok' ? 'Online' : 'Unavailable'))
      .catch((error) => {
        if (error.name !== 'AbortError') setApiStatus('Unavailable')
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container-fluid app-container d-flex align-items-center justify-content-between py-3">
          <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-semibold mb-0" to="/">
            <img className="brand-mark" src={octofitLogo} alt="" width="36" height="36" />
            OctoFit Tracker
          </NavLink>
          <span className={`api-indicator ${apiStatus === 'Online' ? 'is-online' : ''}`} title={API_BASE_URL}>
            API {apiStatus}
          </span>
        </div>
      </header>
      <div className="container-fluid app-container">
        <nav className="nav app-nav" aria-label="Main navigation">
          <NavLink className="nav-link" to="/" end>Overview</NavLink>
          {sections.map(({ label, path }) => (
            <NavLink className="nav-link" to={`/${path}`} key={path}>{label}</NavLink>
          ))}
        </nav>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Overview />} />
            {sections.map(({ path, Component }) => (
              <Route key={path} path={`/${path}`} element={<Component />} />
            ))}
            <Route path="*" element={<Overview />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function Overview() {
  return (
    <section>
      <div className="overview-intro">
        <div className="page-eyebrow">Your training space</div>
        <h1 className="h2 mb-2">Overview</h1>
        <p className="text-secondary mb-0">Your activity, teams, and goals in one place.</p>
      </div>
      <div className="overview-grid">
        {sections.map(({ label, path }, index) => (
          <NavLink to={`/${path}`} className="overview-link" key={path}>
            <span className="overview-index">0{index + 1} / TRACKER</span>
            <span className="overview-title d-block fw-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </section>
  )
}

export default App