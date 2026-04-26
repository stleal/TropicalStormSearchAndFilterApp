import { useEffect, useRef, useState } from 'react'

type TornadoPoint = {
  x: number
  y: number
  radius: number
}

const chartWidth = 1024
const chartHeight = 768
const gridColumns = 16
const gridRows = 12
const padding = { top: 48, right: 56, bottom: 64, left: 72 }
const plotWidth = chartWidth - padding.left - padding.right
const plotHeight = chartHeight - padding.top - padding.bottom
const cellWidth = plotWidth / gridColumns
const cellHeight = plotHeight / gridRows

const basePath: TornadoPoint[] = [
  { x: 1.4, y: 9.8, radius: 0.9 },
  { x: 2.2, y: 9.1, radius: 1.05 },
  { x: 3.1, y: 8.6, radius: 1.15 },
  { x: 4.4, y: 7.8, radius: 1.2 },
  { x: 5.7, y: 6.9, radius: 1.25 },
  { x: 7.1, y: 6.1, radius: 1.35 },
  { x: 8.6, y: 5.2, radius: 1.45 },
  { x: 10.2, y: 4.6, radius: 1.55 },
  { x: 11.5, y: 3.9, radius: 1.5 },
  { x: 12.7, y: 3.2, radius: 1.35 },
  { x: 13.6, y: 2.7, radius: 1.1 },
]

function scaleX(value: number) {
  return padding.left + value * cellWidth
}

function scaleY(value: number) {
  return padding.top + value * cellHeight
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount
}

function buildIntensityMap(radiusScale: number, energy: number) {
  const values = Array.from({ length: gridRows }, () => Array(gridColumns).fill(0))
  let max = 0

  for (let index = 0; index < basePath.length - 1; index += 1) {
    const currentPoint = basePath[index]
    const nextPoint = basePath[index + 1]
    const distance = Math.hypot(nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y)
    const steps = Math.max(10, Math.ceil(distance * 14))

    for (let step = 0; step <= steps; step += 1) {
      const amount = step / steps
      const x = lerp(currentPoint.x, nextPoint.x, amount)
      const y = lerp(currentPoint.y, nextPoint.y, amount)
      const radius = lerp(currentPoint.radius, nextPoint.radius, amount) * radiusScale

      for (let row = 0; row < gridRows; row += 1) {
        for (let column = 0; column < gridColumns; column += 1) {
          const cellX = column + 0.5
          const cellY = row + 0.5
          const offset = Math.hypot(cellX - x, cellY - y)

          if (offset > radius * 1.6) {
            continue
          }

          const normalized = Math.max(0, 1 - offset / (radius * 1.6))
          const contribution = normalized * normalized * energy
          values[row][column] += contribution
          max = Math.max(max, values[row][column])
        }
      }
    }
  }

  return { values, max }
}

function toHeatColor(value: number, max: number) {
  if (max <= 0 || value <= 0) {
    return 'rgba(0, 0, 0, 0)'
  }

  const ratio = Math.min(1, value / max)

  if (ratio < 0.2) {
    return `rgba(110, 193, 255, ${0.18 + ratio * 0.45})`
  }

  if (ratio < 0.45) {
    return `rgba(90, 231, 201, ${0.3 + ratio * 0.35})`
  }

  if (ratio < 0.7) {
    return `rgba(255, 209, 102, ${0.35 + ratio * 0.3})`
  }

  return `rgba(255, 109, 79, ${0.45 + ratio * 0.25})`
}

function IntensityMap() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [radiusScale, setRadiusScale] = useState(1)
  const [energy, setEnergy] = useState(1)

  const intensityMap = buildIntensityMap(radiusScale, energy)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const devicePixelRatio = window.devicePixelRatio || 1
    canvas.width = chartWidth * devicePixelRatio
    canvas.height = chartHeight * devicePixelRatio
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    context.clearRect(0, 0, chartWidth, chartHeight)

    for (let row = 0; row < gridRows; row += 1) {
      for (let column = 0; column < gridColumns; column += 1) {
        const value = intensityMap.values[row][column]

        context.fillStyle = toHeatColor(value, intensityMap.max)
        context.fillRect(
          padding.left + column * cellWidth + 3,
          padding.top + row * cellHeight + 3,
          cellWidth - 6,
          cellHeight - 6,
        )
      }
    }
  }, [intensityMap, radiusScale, energy])

  const polylinePoints = basePath
    .map((point) => `${scaleX(point.x)},${scaleY(point.y)}`)
    .join(' ')

  const highlightedCells = intensityMap.values.flat().filter((value) => value > 0.9).length

  return (
    <section id="intensity-map" className="section-anchor mt-4 mt-md-5">
      <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-dark rounded-pill px-3 py-2 mb-2">Intensity Map</span>
          <h2 className="display-6 fw-bold mb-2">Trajectory Heat Map Workbench</h2>
          <p className="text-body-secondary mb-0">
            This view layers a canvas heat map under an SVG storm track so you can test how
            footprint width and energy shift affected grid cells.
          </p>
        </div>
        <a className="btn btn-outline-primary rounded-pill px-4" href="#map-controls">
          Adjust Controls
        </a>
      </div>

      <div className="row align-items-start g-4 g-xl-5">
        <div className="col-12 col-xl-4">
          <div className="copy-panel p-4 p-lg-5 rounded-4 shadow-sm h-100">
            <h3 className="h2 fw-bold text-primary-emphasis mb-3">Storm Track Intensity</h3>
            <p className="lead text-body-secondary mb-4">
              The grid uses the same Bootstrap theme as the rest of the app while preserving the
              TrajectoryPathApp chart logic and pixel heat rendering.
            </p>
            <div className="small text-body-secondary d-grid gap-2">
              <div className="d-flex justify-content-between border-top pt-3">
                <span>Viewport</span>
                <strong>1024 x 768</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Grid</span>
                <strong>{gridColumns} x {gridRows}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Impacted cells</span>
                <strong>{highlightedCells}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Track points</span>
                <strong>{basePath.length}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <section
            className="media-stage rounded-4 shadow-lg overflow-hidden"
            aria-label="Tornado path simulation preview"
          >
            <canvas
              ref={canvasRef}
              className="media-stage__canvas"
              width={chartWidth}
              height={chartHeight}
              aria-hidden="true"
            />
            <svg
              className="media-stage__overlay"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label="Grid chart showing a sample tornado track"
              preserveAspectRatio="none"
            >
              <rect
                x={padding.left}
                y={padding.top}
                width={plotWidth}
                height={plotHeight}
                className="chart-frame"
              />

              {Array.from({ length: gridColumns + 1 }, (_, index) => {
                const x = padding.left + index * cellWidth

                return (
                  <g key={`vertical-${index}`}>
                    <line
                      x1={x}
                      x2={x}
                      y1={padding.top}
                      y2={padding.top + plotHeight}
                      className="chart-gridline"
                    />
                    {index < gridColumns ? (
                      <text
                        x={x + cellWidth / 2}
                        y={chartHeight - 20}
                        textAnchor="middle"
                        className="chart-label"
                      >
                        {index + 1}
                      </text>
                    ) : null}
                  </g>
                )
              })}

              {Array.from({ length: gridRows + 1 }, (_, index) => {
                const y = padding.top + index * cellHeight

                return (
                  <g key={`horizontal-${index}`}>
                    <line
                      x1={padding.left}
                      x2={padding.left + plotWidth}
                      y1={y}
                      y2={y}
                      className="chart-gridline"
                    />
                    {index < gridRows ? (
                      <text
                        x={36}
                        y={y + cellHeight / 2 + 5}
                        textAnchor="middle"
                        className="chart-label"
                      >
                        {gridRows - index}
                      </text>
                    ) : null}
                  </g>
                )
              })}

              <polyline points={polylinePoints} className="chart-path" />

              {basePath.map((point, index) => (
                <g key={`${point.x}-${point.y}`}>
                  <circle
                    cx={scaleX(point.x)}
                    cy={scaleY(point.y)}
                    r={point.radius * radiusScale * 24}
                    className="chart-footprint"
                  />
                  <circle
                    cx={scaleX(point.x)}
                    cy={scaleY(point.y)}
                    r="5"
                    className="chart-node"
                  />
                  <text
                    x={scaleX(point.x)}
                    y={scaleY(point.y) - 14}
                    textAnchor="middle"
                    className="chart-node-label"
                  >
                    P{index + 1}
                  </text>
                </g>
              ))}

              <text
                x={chartWidth / 2}
                y={chartHeight - 8}
                textAnchor="middle"
                className="chart-axis-title"
              >
                East-west grid columns
              </text>
              <text
                x={18}
                y={chartHeight / 2}
                textAnchor="middle"
                className="chart-axis-title"
                transform={`rotate(-90 18 ${chartHeight / 2})`}
              >
                South-north grid rows
              </text>
            </svg>
          </section>

          <section id="map-controls" className="control-panel mt-3 rounded-4 p-3 p-lg-4 shadow-sm">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
              <div>
                <h3 className="h5 mb-1">Path controls</h3>
                <p className="small text-body-secondary mb-0">
                  Adjust footprint width and energy to test the heat map renderer.
                </p>
              </div>
              <span className="badge text-bg-primary-subtle text-primary-emphasis px-3 py-2">
                Sample track loaded
              </span>
            </div>

            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" htmlFor="radiusScale">
                  Footprint scale: {radiusScale.toFixed(1)}x
                </label>
                <input
                  id="radiusScale"
                  className="form-range"
                  type="range"
                  min="0.6"
                  max="1.8"
                  step="0.1"
                  value={radiusScale}
                  onChange={(event) => setRadiusScale(Number(event.target.value))}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold" htmlFor="energy">
                  Energy gain: {energy.toFixed(1)}x
                </label>
                <input
                  id="energy"
                  className="form-range"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={energy}
                  onChange={(event) => setEnergy(Number(event.target.value))}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default IntensityMap