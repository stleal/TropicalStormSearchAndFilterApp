type WindDay = {
  day: string
  speedMph: number
  gustMph: number
}

type WindSpeedProps = {
  data: WindDay[]
}

function WindSpeed({ data }: WindSpeedProps) {
  const peakDay = data.reduce((highest, day) => (day.gustMph > highest.gustMph ? day : highest), data[0])

  return (
    <section id="wind-speed" className="card border-0 shadow-sm section-anchor h-100">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h3 className="h4 mb-1">Wind Speed Trend</h3>
            <p className="text-body-secondary mb-0">Sample wind speed readings for the last 7 days.</p>
          </div>
          <div className="badge text-bg-info rounded-pill px-3 py-2">Peak gust: {peakDay.gustMph} mph</div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Sustained Wind</th>
                <th scope="col">Peak Gust</th>
              </tr>
            </thead>
            <tbody>
              {data.map((day) => (
                <tr key={day.day}>
                  <th scope="row">{day.day}</th>
                  <td>{day.speedMph} mph</td>
                  <td>{day.gustMph} mph</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default WindSpeed