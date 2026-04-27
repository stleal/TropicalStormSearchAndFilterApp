type PressureDay = {
  day: string
  pressureMb: number
  zone: string
}

type AirPressureProps = {
  data: PressureDay[]
}

function AirPressure({ data }: AirPressureProps) {
  const lowestPressure = data.reduce((lowest, day) => (day.pressureMb < lowest.pressureMb ? day : lowest), data[0])

  return (
    <section id="pressure" className="card border-0 shadow-sm section-anchor h-100">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h3 className="h4 mb-1">Air Pressure Trend</h3>
            <p className="text-body-secondary mb-0">Sample air pressure readings for the last 7 days.</p>
          </div>
          <div className="badge text-bg-warning rounded-pill px-3 py-2">
            Lowest pressure: {lowestPressure.pressureMb} mb
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Pressure</th>
                <th scope="col">Pressure Zone</th>
              </tr>
            </thead>
            <tbody>
              {data.map((day) => (
                <tr key={day.day}>
                  <th scope="row">{day.day}</th>
                  <td>{day.pressureMb} mb</td>
                  <td>{day.zone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AirPressure