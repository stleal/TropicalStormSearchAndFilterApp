type RainfallDay = {
  day: string
  inches: number
  advisory: string
}

type RainfallProps = {
  data: RainfallDay[]
}

function Rainfall({ data }: RainfallProps) {
  const wettestDay = data.reduce((highest, day) => (day.inches > highest.inches ? day : highest), data[0])

  return (
    <section id="rainfall" className="card border-0 shadow-sm section-anchor h-100">
      <div className="card-body p-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
          <div>
            <h3 className="h4 mb-1">Rainfall Trend</h3>
            <p className="text-body-secondary mb-0">Sample rainfall totals for the last 7 days.</p>
          </div>
          <div className="badge text-bg-primary rounded-pill px-3 py-2">Wettest day: {wettestDay.inches}"</div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Rainfall</th>
                <th scope="col">Advisory</th>
              </tr>
            </thead>
            <tbody>
              {data.map((day) => (
                <tr key={day.day}>
                  <th scope="row">{day.day}</th>
                  <td>{day.inches}"</td>
                  <td>{day.advisory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default Rainfall