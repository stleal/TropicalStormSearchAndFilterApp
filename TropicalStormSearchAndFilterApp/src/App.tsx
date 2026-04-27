import { useState } from 'react'
import Dashboard from './components/Dashboard'
import IntensityMap from './components/IntensityMap'
import StormSearch from './components/StormSearch'
import { deliveryRoadmap, forecastHighlights, modelingLab } from './config/appData'

const menuItems = ['Overview', 'Dashboard', 'Search', 'Intensity Map'] as const

const viewDetails = {
  Overview: {
    statusLabel: 'Project overview screen',
    ctaLabel: 'Jump to roadmap',
    ctaHref: '#roadmap',
  },
  Dashboard: {
    statusLabel: 'Storm operations dashboard screen',
    ctaLabel: 'Review storm summary',
    ctaHref: '#storm-summary',
  },
  Search: {
    statusLabel: 'Storm search and advisory table',
    ctaLabel: 'Open storm table',
    ctaHref: '#storm-search-table',
  },
  'Intensity Map': {
    statusLabel: 'Storm trajectory intensity workbench',
    ctaLabel: 'Open map controls',
    ctaHref: '#map-controls',
  },
} as const

function App() {
  const [activeView, setActiveView] = useState<(typeof menuItems)[number]>('Overview')
  const currentView = viewDetails[activeView]
  const contentColumnClass = activeView === 'Intensity Map' ? 'col-12' : 'col-12 col-xl-10'

  return (
    <div className="app-shell">
      <header className="app-header sticky-top shadow-sm">
        <nav className="navbar navbar-expand-md py-3 py-lg-4">
          <div className="container d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 gap-lg-4">
            <div className="d-flex flex-column app-brand-block">
              <span className="app-kicker">Atlantic Operations Console</span>
              <a className="navbar-brand fw-bold text-primary-emphasis mb-0" href="#top">
                Hawks Weather Lab
              </a>
              <span className="small text-body-secondary">Catastrophe modeling demo workspace</span>
            </div>

            <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-3 ms-lg-auto w-100 app-nav-cluster">
              <div className="app-status-chip">
                <span className="app-status-dot" aria-hidden="true" />
                <span>{currentView.statusLabel}</span>
              </div>

              <ul className="navbar-nav flex-row flex-wrap gap-1 gap-md-2 app-menu-bar">
                {menuItems.map((item) => (
                  <li key={item} className="nav-item">
                    <button
                      type="button"
                      className={`nav-link px-3 px-md-4 border-0 ${
                        activeView === item ? 'active' : ''
                      }`}
                      onClick={() => setActiveView(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>

              <a className="btn btn-sm rounded-pill app-nav-cta" href={currentView.ctaHref}>
                {currentView.ctaLabel}
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main id="top" className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className={contentColumnClass}>
            {activeView === 'Overview' ? (
              <section id="overview" className="card border-0 shadow-lg overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <span className="badge text-bg-primary rounded-pill px-3 py-2 mb-3">
                    React + TypeScript Base App
                  </span>
                  <h1 className="display-5 fw-bold text-primary-emphasis mb-3">
                    Tropical Storm Search and Filter App
                  </h1>
                  <p className="lead text-body-secondary mb-4">
                    This application is the starting point for a weather-focused modeling workspace built with React,
                    TypeScript, and TSX. The goal is to combine forecast storytelling, storm tracking, and interactive
                    data visualization in one place.
                  </p>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div id="forecast-focus" className="h-100 p-4 bg-body-tertiary border rounded-4 section-anchor">
                        <h2 className="h4 mb-3">Weather and Alert Focus</h2>
                        <ul className="mb-0 ps-3">
                          {forecastHighlights.map((item) => (
                            <li key={item} className="mb-2">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div id="modeling-lab" className="h-100 p-4 bg-body-tertiary border rounded-4 section-anchor">
                        <h2 className="h4 mb-3">Modeling and Physics Lab</h2>
                        <ul className="mb-0 ps-3">
                          {modelingLab.map((item) => (
                            <li key={item} className="mb-2">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="row g-4 align-items-stretch">
                    <div className="col-lg-7">
                      <div className="h-100 p-4 border rounded-4 bg-primary-subtle">
                        <h2 className="h4 mb-3">What This App Is About</h2>
                        <p className="mb-3">
                          Think of this as a demonstration platform for storm alerts, futurecast thinking, and catastrophe
                          modeling ideas similar to what viewers expect from regional weather coverage in Boston and other
                          coastal markets.
                        </p>
                        <p className="mb-0">
                          It is also a safe sandbox for experimenting with charts, simulation ideas, and UI concepts before
                          handing a more mature build to a development team.
                        </p>
                      </div>
                    </div>

                    <div className="col-lg-5">
                      <div id="roadmap" className="h-100 p-4 border rounded-4 section-anchor">
                        <h2 className="h4 mb-3">Demo Roadmap</h2>
                        <ol className="mb-0 ps-3">
                          {deliveryRoadmap.map((item) => (
                            <li key={item} className="mb-2">
                              {item}
                            </li>
                          ))}
                        </ol>
                        <div className="alert alert-info mt-4 mb-0" role="alert">
                          End state: a go-live ready concept package to send to the KCC development team.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : activeView === 'Dashboard' ? (
              <Dashboard />
            ) : activeView === 'Intensity Map' ? (
              <IntensityMap />
            ) : (
              <StormSearch />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
