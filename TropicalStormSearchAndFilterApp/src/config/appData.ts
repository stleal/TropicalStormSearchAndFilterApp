export type WindSpeedDay = {
  day: string
  speedMph: number
  gustMph: number
}

export type PressureDay = {
  day: string
  pressureMb: number
  zone: string
}

export type RainfallDay = {
  day: string
  inches: number
  advisory: string
}

export type ZipRainfallProfile = {
  zipCode: string
  location: string
  data: RainfallDay[]
}

export type AlertItem = {
  county: string
  level: string
  note: string
}

export type StormRecord = {
  id: string
  name: string
  basin: string
  category: string
  maxWindMph: number
  pressureMb: number
  advisory: string
  landfallRisk: string
}

const rainfallDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

const basinZipCatalog: Record<string, Array<{ zipCode: string; location: string; multiplier: number }>> = {
  Atlantic: [
    { zipCode: '02108', location: 'Boston Harbor', multiplier: 0.94 },
    { zipCode: '02840', location: 'Newport Coast', multiplier: 1.06 },
    { zipCode: '00901', location: 'San Juan Waterfront', multiplier: 1.18 },
  ],
  'East Pacific': [
    { zipCode: '92101', location: 'San Diego Bay', multiplier: 0.82 },
    { zipCode: '90802', location: 'Long Beach', multiplier: 0.9 },
    { zipCode: '96815', location: 'Honolulu South Shore', multiplier: 1.08 },
  ],
  'North Indian': [
    { zipCode: '700001', location: 'Kolkata Port', multiplier: 1.12 },
    { zipCode: '600001', location: 'Chennai Coast', multiplier: 1.05 },
    { zipCode: '682001', location: 'Kochi Harbor', multiplier: 0.96 },
  ],
  'South Pacific': [
    { zipCode: '1010', location: 'Auckland Central', multiplier: 0.88 },
    { zipCode: '6011', location: 'Wellington Waterfront', multiplier: 0.94 },
    { zipCode: '0000', location: 'Suva Harbor', multiplier: 1.1 },
  ],
  'South Indian': [
    { zipCode: '400001', location: 'Mumbai Harbor', multiplier: 0.84 },
    { zipCode: '744101', location: 'Port Blair', multiplier: 1.02 },
    { zipCode: '33701', location: 'St. Denis Coast', multiplier: 1.14 },
  ],
}

function getRainfallAdvisory(totalInches: number) {
  if (totalInches >= 9.5) return 'Major runoff concern'
  if (totalInches >= 7.5) return 'Flash flood warning'
  if (totalInches >= 5.5) return 'Flash flood watch'
  if (totalInches >= 3.5) return 'Street flooding possible'
  if (totalInches >= 2) return 'Urban flood watch'
  if (totalInches >= 1) return 'Localized ponding'

  return 'Normal monitoring'
}

function buildRainfallSeries(finalTotal: number, phaseShift: number): RainfallDay[] {
  const progressiveShare = [0.14, 0.24, 0.36, 0.52, 0.7, 0.86, 1]

  return rainfallDays.map((day, index) => {
    const stormPulse = ((index + phaseShift) % 3) * 0.12
    const total = Number((finalTotal * progressiveShare[index] + stormPulse).toFixed(1))

    return {
      day,
      inches: index === progressiveShare.length - 1 ? Number(finalTotal.toFixed(1)) : total,
      advisory: getRainfallAdvisory(total),
    }
  })
}

function getBaseRainfallTotal(storm: StormRecord) {
  const windFactor = storm.maxWindMph / 18
  const pressureFactor = Math.max(0, (1008 - storm.pressureMb) / 7)
  const riskFactor =
    storm.landfallRisk === 'Extreme' ? 2.6 : storm.landfallRisk === 'High' ? 1.8 : storm.landfallRisk === 'Moderate' ? 1 : 0.4

  return 1.6 + windFactor + pressureFactor + riskFactor
}

function buildZipRainfallProfiles(storm: StormRecord): ZipRainfallProfile[] {
  const zipCatalog = basinZipCatalog[storm.basin] ?? basinZipCatalog.Atlantic
  const baseTotal = getBaseRainfallTotal(storm)

  return zipCatalog.map((zipEntry, index) => {
    const finalTotal = Number((baseTotal * zipEntry.multiplier + index * 0.35).toFixed(1))

    return {
      zipCode: zipEntry.zipCode,
      location: zipEntry.location,
      data: buildRainfallSeries(finalTotal, index + storm.name.length),
    }
  })
}

export const forecastHighlights = [
  '7-day forecast and 7-day futurecast',
  'Current wind speed and pressure-zone tracking',
  'Storm alert concepts inspired by regional weather coverage',
  'Futurecast and projectile motion experiments',
]

export const modelingLab = [
  'Counterclockwise spinning-top simulation',
  'Mini physics engine prototype with Copilot',
  'Chart.js scatterplot and bar graph concepts',
  'Catastrophe modeling sandbox for phase-by-phase demos',
]

export const deliveryRoadmap = ['Phase 1', 'Phase 2', 'Phase 3', 'Go live with KCC development handoff']

export const windSpeedData: WindSpeedDay[] = [
  { day: 'Mon', speedMph: 64, gustMph: 78 },
  { day: 'Tue', speedMph: 71, gustMph: 84 },
  { day: 'Wed', speedMph: 82, gustMph: 97 },
  { day: 'Thu', speedMph: 95, gustMph: 110 },
  { day: 'Fri', speedMph: 108, gustMph: 124 },
  { day: 'Sat', speedMph: 119, gustMph: 136 },
  { day: 'Sun', speedMph: 132, gustMph: 148 },
]

export const airPressureData: PressureDay[] = [
  { day: 'Mon', pressureMb: 995, zone: 'Outer high-pressure edge' },
  { day: 'Tue', pressureMb: 988, zone: 'Pressure gradient forming' },
  { day: 'Wed', pressureMb: 980, zone: 'Tropical low intensifying' },
  { day: 'Thu', pressureMb: 972, zone: 'Coastal low-pressure lane' },
  { day: 'Fri', pressureMb: 964, zone: 'Rapid deepening phase' },
  { day: 'Sat', pressureMb: 955, zone: 'Major hurricane core' },
  { day: 'Sun', pressureMb: 948, zone: 'Peak low-pressure center' },
]

export const rainfallData: RainfallDay[] = [
  { day: 'Mon', inches: 0.8, advisory: 'Normal monitoring' },
  { day: 'Tue', inches: 1.3, advisory: 'Localized ponding' },
  { day: 'Wed', inches: 2.1, advisory: 'Urban flood watch' },
  { day: 'Thu', inches: 3.4, advisory: 'Street flooding possible' },
  { day: 'Fri', inches: 4.6, advisory: 'Flash flood watch' },
  { day: 'Sat', inches: 5.9, advisory: 'Flash flood warning' },
  { day: 'Sun', inches: 6.8, advisory: 'Major runoff concern' },
]

export const alertItems: AlertItem[] = [
  { county: 'Suffolk County', level: 'Warning', note: 'Storm surge barriers may be needed.' },
  { county: 'Norfolk County', level: 'Watch', note: 'Monitor shoreline wind-field expansion.' },
  { county: 'Plymouth County', level: 'Evacuate', note: 'Prepare staged coastal evacuation routes.' },
]

export const stormData: StormRecord[] = [
  { id: 'ATL-001', name: 'Alex', basin: 'Atlantic', category: 'Tropical Storm', maxWindMph: 52, pressureMb: 1002, advisory: 'Monitoring coastal showers', landfallRisk: 'Low' },
  { id: 'ATL-002', name: 'Bonnie', basin: 'Atlantic', category: 'Category 1', maxWindMph: 82, pressureMb: 984, advisory: 'Outer bands nearing Bermuda', landfallRisk: 'Moderate' },
  { id: 'ATL-003', name: 'Colin', basin: 'Atlantic', category: 'Tropical Depression', maxWindMph: 33, pressureMb: 1007, advisory: 'Weak circulation drifting east', landfallRisk: 'Low' },
  { id: 'ATL-004', name: 'Danielle', basin: 'Atlantic', category: 'Category 2', maxWindMph: 101, pressureMb: 968, advisory: 'Rapid strengthening overnight', landfallRisk: 'High' },
  { id: 'ATL-005', name: 'Earl', basin: 'Atlantic', category: 'Category 3', maxWindMph: 121, pressureMb: 952, advisory: 'Major hurricane core expanding', landfallRisk: 'High' },
  { id: 'ATL-006', name: 'Fiona', basin: 'Atlantic', category: 'Category 4', maxWindMph: 138, pressureMb: 941, advisory: 'Storm surge risk rising', landfallRisk: 'Extreme' },
  { id: 'ATL-007', name: 'Gaston', basin: 'Atlantic', category: 'Tropical Storm', maxWindMph: 61, pressureMb: 997, advisory: 'Heavy rain bands on approach', landfallRisk: 'Moderate' },
  { id: 'ATL-008', name: 'Hermine', basin: 'Atlantic', category: 'Category 1', maxWindMph: 77, pressureMb: 987, advisory: 'Coastal wind alerts posted', landfallRisk: 'Moderate' },
  { id: 'ATL-009', name: 'Ian', basin: 'Atlantic', category: 'Category 5', maxWindMph: 157, pressureMb: 928, advisory: 'Catastrophic eyewall intact', landfallRisk: 'Extreme' },
  { id: 'ATL-010', name: 'Julia', basin: 'Atlantic', category: 'Category 1', maxWindMph: 79, pressureMb: 985, advisory: 'Land interaction beginning', landfallRisk: 'Moderate' },
  { id: 'PAC-011', name: 'Kay', basin: 'East Pacific', category: 'Category 2', maxWindMph: 104, pressureMb: 965, advisory: 'Strong surf and rainfall likely', landfallRisk: 'High' },
  { id: 'PAC-012', name: 'Lester', basin: 'East Pacific', category: 'Tropical Storm', maxWindMph: 57, pressureMb: 998, advisory: 'Watching for organized convection', landfallRisk: 'Low' },
  { id: 'PAC-013', name: 'Madeline', basin: 'East Pacific', category: 'Category 1', maxWindMph: 86, pressureMb: 981, advisory: 'Track bending north-northwest', landfallRisk: 'Moderate' },
  { id: 'PAC-014', name: 'Newton', basin: 'East Pacific', category: 'Tropical Storm', maxWindMph: 49, pressureMb: 1001, advisory: 'Localized flooding possible', landfallRisk: 'Low' },
  { id: 'PAC-015', name: 'Orlene', basin: 'East Pacific', category: 'Category 4', maxWindMph: 144, pressureMb: 936, advisory: 'Major hurricane near peak intensity', landfallRisk: 'Extreme' },
  { id: 'PAC-016', name: 'Paine', basin: 'East Pacific', category: 'Tropical Depression', maxWindMph: 30, pressureMb: 1009, advisory: 'Remnant moisture plume spreading inland', landfallRisk: 'Low' },
  { id: 'PAC-017', name: 'Roslyn', basin: 'East Pacific', category: 'Category 3', maxWindMph: 128, pressureMb: 948, advisory: 'Dangerous surf and surge signal', landfallRisk: 'High' },
  { id: 'PAC-018', name: 'Seymour', basin: 'East Pacific', category: 'Category 4', maxWindMph: 141, pressureMb: 938, advisory: 'Well-defined eye feature visible', landfallRisk: 'Moderate' },
  { id: 'IND-019', name: 'Tara', basin: 'North Indian', category: 'Cyclonic Storm', maxWindMph: 68, pressureMb: 992, advisory: 'Port conditions worsening', landfallRisk: 'Moderate' },
  { id: 'IND-020', name: 'Uma', basin: 'North Indian', category: 'Severe Cyclonic Storm', maxWindMph: 97, pressureMb: 972, advisory: 'Heavy rainfall across delta region', landfallRisk: 'High' },
  { id: 'IND-021', name: 'Varun', basin: 'North Indian', category: 'Depression', maxWindMph: 29, pressureMb: 1008, advisory: 'Low-end monsoon circulation', landfallRisk: 'Low' },
  { id: 'SHEM-022', name: 'Willa', basin: 'South Pacific', category: 'Category 2', maxWindMph: 109, pressureMb: 962, advisory: 'Marine warning extended eastward', landfallRisk: 'Moderate' },
  { id: 'SHEM-023', name: 'Xena', basin: 'South Pacific', category: 'Tropical Cyclone', maxWindMph: 73, pressureMb: 989, advisory: 'Squalls impacting island chain', landfallRisk: 'Moderate' },
  { id: 'SHEM-024', name: 'Yara', basin: 'South Indian', category: 'Category 3', maxWindMph: 126, pressureMb: 950, advisory: 'Eyewall replacement underway', landfallRisk: 'High' },
  { id: 'SHEM-025', name: 'Zane', basin: 'South Indian', category: 'Tropical Storm', maxWindMph: 58, pressureMb: 999, advisory: 'Open-ocean system under review', landfallRisk: 'Low' },
]

export const rainfallByStormId: Record<string, ZipRainfallProfile[]> = Object.fromEntries(
  stormData.map((storm) => [storm.id, buildZipRainfallProfiles(storm)]),
)

export const defaultStormId = 'ATL-009'