import { useState } from 'react'
import { stormData } from '../config/appData'

function StormSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [rowsToShow, setRowsToShow] = useState(10)

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredStorms = stormData.filter((storm) => {
    const searchableText = [storm.id, storm.name, storm.basin, storm.category, storm.advisory, storm.landfallRisk]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(normalizedSearch)
  })
  const visibleStorms = filteredStorms.slice(0, rowsToShow)

  return (
    <section id="storm-search" className="section-anchor mt-4 mt-md-5">
      <div className="card border-0 shadow-lg overflow-hidden storm-search-panel">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
            <div>
              <span className="badge text-bg-primary rounded-pill px-3 py-2 mb-3">Storm Search</span>
              <h2 className="display-6 fw-bold mb-2">Storm Advisory Search Desk</h2>
              <p className="lead text-body-secondary mb-0">
                Search across 25 sample storm records and control how many rows are visible in the advisory table.
              </p>
            </div>
            <div className="storm-results-chip">
              Showing {visibleStorms.length} of {filteredStorms.length} matching storms
            </div>
          </div>

          <div className="row g-3 align-items-end mb-4">
            <div className="col-lg-8">
              <label className="form-label fw-semibold" htmlFor="storm-search-input">
                Search storms
              </label>
              <input
                id="storm-search-input"
                type="search"
                className="form-control form-control-lg storm-search-input"
                placeholder="Search by name, basin, category, advisory, or risk"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="col-sm-6 col-lg-4">
              <label className="form-label fw-semibold" htmlFor="storm-row-filter">
                Rows to view
              </label>
              <select
                id="storm-row-filter"
                className="form-select form-select-lg storm-row-filter"
                value={rowsToShow}
                onChange={(event) => setRowsToShow(Number(event.target.value))}
              >
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={25}>25 rows</option>
              </select>
            </div>
          </div>

          <div id="storm-search-table" className="table-responsive storm-table-wrap">
            <table className="table align-middle mb-0 storm-table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Storm</th>
                  <th scope="col">Basin</th>
                  <th scope="col">Category</th>
                  <th scope="col">Max Wind</th>
                  <th scope="col">Pressure</th>
                  <th scope="col">Landfall Risk</th>
                  <th scope="col">Advisory</th>
                </tr>
              </thead>
              <tbody>
                {visibleStorms.map((storm) => (
                  <tr key={storm.id}>
                    <td className="fw-semibold">{storm.id}</td>
                    <td>{storm.name}</td>
                    <td>{storm.basin}</td>
                    <td>{storm.category}</td>
                    <td>{storm.maxWindMph} mph</td>
                    <td>{storm.pressureMb} mb</td>
                    <td>
                      <span className="badge rounded-pill text-bg-light border storm-risk-badge">{storm.landfallRisk}</span>
                    </td>
                    <td>{storm.advisory}</td>
                  </tr>
                ))}
                {visibleStorms.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-body-secondary">
                      No storms matched your search.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default StormSearch