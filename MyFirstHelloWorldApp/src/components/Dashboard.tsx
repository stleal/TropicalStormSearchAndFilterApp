import { useState } from 'react'
import AirPressure from './AirPressure'
import Rainfall from './Rainfall'
import WindSpeed from './WindSpeed'
import {
  airPressureData,
  alertItems,
  defaultStormId,
  rainfallData,
  stormData,
  windSpeedData,
} from '../config/appData'

function Dashboard() {
  const [selectedStormId, setSelectedStormId] = useState(defaultStormId)
  const selectedStorm  = stormData.find((storm) => storm.id === selectedStormId) ?? stormData[0]
  const latestRainfall = rainfallData[rainfallData.length - 1]
  const riskToneClass = selectedStorm.landfallRisk === 'Extreme' ? 'danger' : selectedStorm.landfallRisk === 'High' ? 'warning' : 'secondary'
  const summaryCards = [
    {
      title: 'Storm Summary',
      value: selectedStorm.name,
      detail: `${selectedStorm.basin} basin operational snapshot`,
      href: '#storm-summary',
    },
    {
      title: 'Current Category',
      value: selectedStorm.category,
      detail: `${selectedStorm.landfallRisk} landfall concern`,
      href: '#current-category',
    },
    {
      title: 'Wind Speed',
      value: `${selectedStorm.maxWindMph} mph`,
      detail: 'Maximum sustained wind estimate',
      href: '#wind-speed',
    },
    {
      title: 'Pressure',
      value: `${selectedStorm.pressureMb} mb`,
      detail: 'Minimum central pressure reading',
      href: '#pressure',
    },
    {
      title: 'Rainfall',
      value: `${latestRainfall.inches} in`,
      detail: latestRainfall.advisory,
      href: '#rainfall',
    },
    {
      title: 'Alert State',
      value: selectedStorm.landfallRisk,
      detail: selectedStorm.advisory,
      href: '#alert-state',
    },
  ]

  return (
    <section id="dashboard" className="section-anchor mt-4 mt-md-5">
      <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-dark rounded-pill px-3 py-2 mb-2">Dashboard</span>
          <h2 className="display-6 fw-bold mb-2">Storm Operations Dashboard</h2>
          <p className="text-body-secondary mb-0">
            Select a storm from the shared dataset, then use the cards to jump to category, wind speed, pressure,
            rainfall, and alert details.
          </p>
        </div>
        <a className="btn btn-outline-primary rounded-pill px-4" href="#storm-summary">
          Review Summary
        </a>
      </div>

      <div className="row g-3 mb-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="col-sm-6 col-xl-4">
            <a className="card h-100 border-0 shadow-sm text-reset dashboard-link" href={card.href}>
              <div className="card-body p-4">
                <p className="text-uppercase small fw-semibold text-body-secondary mb-2">{card.title}</p>
                <h3 className="h4 mb-2">{card.value}</h3>
                <p className="mb-0 text-body-secondary">{card.detail}</p>
              </div>
            </a>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <section id="storm-summary" className="card border-0 shadow-sm section-anchor h-100">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-xl-row align-items-xl-end justify-content-between gap-3 mb-4">
                <div>
                  <h3 className="h4 mb-1">Storm Summary Cards</h3>
                  <p className="text-body-secondary mb-0">
                    Snapshot of {selectedStorm.name} before drilling into each data series.
                  </p>
                </div>
                <div className="dashboard-storm-picker">
                  <label className="form-label fw-semibold small text-uppercase text-body-secondary mb-2" htmlFor="dashboard-storm-select">
                    Select Storm
                  </label>
                  <select
                    id="dashboard-storm-select"
                    className="form-select dashboard-storm-select"
                    value={selectedStorm.id}
                    onChange={(event) => setSelectedStormId(event.target.value)}
                  >
                    {stormData.map((storm) => (
                      <option key={storm.id} value={storm.id}>
                        {storm.name} · {storm.basin} · {storm.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-sm-6 col-xl-3">
                  <div id="current-category" className="border rounded-4 p-3 h-100 bg-primary-subtle section-anchor">
                    <p className="small text-uppercase fw-semibold text-body-secondary mb-2">Current Category</p>
                    <h4 className="h3 mb-1">{selectedStorm.category}</h4>
                    <p className="mb-0 text-body-secondary">{selectedStorm.name} remains under active monitoring.</p>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="border rounded-4 p-3 h-100 bg-info-subtle">
                    <p className="small text-uppercase fw-semibold text-body-secondary mb-2">Wind Speed</p>
                    <h4 className="h3 mb-1">{selectedStorm.maxWindMph} mph</h4>
                    <p className="mb-0 text-body-secondary">Peak sustained winds for the current advisory cycle.</p>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="border rounded-4 p-3 h-100 bg-warning-subtle">
                    <p className="small text-uppercase fw-semibold text-body-secondary mb-2">Pressure</p>
                    <h4 className="h3 mb-1">{selectedStorm.pressureMb} mb</h4>
                    <p className="mb-0 text-body-secondary">Core pressure remains tied to the selected storm profile.</p>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="border rounded-4 p-3 h-100 bg-success-subtle">
                    <p className="small text-uppercase fw-semibold text-body-secondary mb-2">Rainfall</p>
                    <h4 className="h3 mb-1">{latestRainfall.inches} in</h4>
                    <p className="mb-0 text-body-secondary">{latestRainfall.advisory}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="col-lg-4">
          <section id="alert-state" className="card border-0 shadow-sm section-anchor h-100">
            <div className="card-body p-4">
              <h3 className="h4 mb-3">Alert State</h3>
              <div className="alert alert-warning d-flex align-items-center justify-content-between gap-3" role="alert">
                <div>
                  <strong>{selectedStorm.landfallRisk}</strong>
                  <div className="small">{selectedStorm.advisory}</div>
                </div>
                <span className={`badge text-bg-${riskToneClass} rounded-pill`}>{selectedStorm.basin}</span>
              </div>

              <div className="list-group list-group-flush">
                {alertItems.map((item) => (
                  <div key={item.county} className="list-group-item px-0">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h4 className="h6 mb-1">{item.county}</h4>
                        <p className="mb-0 text-body-secondary small">{item.note}</p>
                      </div>
                      <span className="badge text-bg-secondary rounded-pill">{item.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <WindSpeed data={windSpeedData} />
        </div>
        <div className="col-12 col-xl-4">
          <AirPressure data={airPressureData} />
        </div>
        <div className="col-12 col-xl-4">
          <Rainfall data={rainfallData} />
        </div>
      </div>
    </section>
  )
}

export default Dashboard