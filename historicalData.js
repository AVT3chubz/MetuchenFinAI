// Representative historical municipal finance & civic data for the Borough of Metuchen, NJ.
// Figures are illustrative, built to reflect real economic context across each era (1926-2026).

// ── Annual total municipal expenses 1926-2026 (nominal USD) ──────────────────────
export const historicalExpenses = (() => {
  const data = [];
  let value = 45000; // 1926 base (~$640K in 2025 dollars)
  const push = (year) => data.push({ year, totalExpense: Math.round(value) });

  // 1926-1929: Roaring Twenties, modest growth
  for (let y = 1926; y <= 1929; y++) { push(y); value *= 1.04; }
  // 1930-1933: Great Depression, sharp contraction
  const dep = [0.88, 0.78, 0.72, 0.95];
  for (let i = 0; i < 4; i++) { value *= dep[i]; push(1930 + i); }
  // 1934-1941: New Deal recovery
  for (let y = 1934; y <= 1941; y++) { value *= 1.09; push(y); }
  // 1942-1945: WWII, flat
  for (let y = 1942; y <= 1945; y++) { value *= 1.02; push(y); }
  // 1946-1955: postwar boom
  for (let y = 1946; y <= 1955; y++) { value *= 1.11; push(y); }
  // 1956-1969: suburban expansion
  for (let y = 1956; y <= 1969; y++) { value *= 1.07; push(y); }
  // 1970-1980: inflation era
  for (let y = 1970; y <= 1980; y++) { value *= 1.115; push(y); }
  // 1981-1990
  for (let y = 1981; y <= 1990; y++) { value *= 1.06; push(y); }
  // 1991-2007
  for (let y = 1991; y <= 2007; y++) { value *= 1.05; push(y); }
  // 2008-2009: Great Recession
  value *= 0.95; push(2008); value *= 0.97; push(2009);
  // 2010-2019
  for (let y = 2010; y <= 2019; y++) { value *= 1.035; push(y); }
  // 2020: COVID
  value *= 1.08; push(2020);
  // 2021-2024
  for (let y = 2021; y <= 2024; y++) { value *= 1.04; push(y); }
  // 2025-2026
  value *= 1.03; push(2025); value *= 1.03; push(2026);

  return data.sort((a, b) => a.year - b.year);
})();

// Decade inflection notes for the scatter plot
export const expenseMilestones = [
  { year: 1929, event: "Market crash", note: "Great Depression begins" },
  { year: 1933, event: "Depression trough", note: "Lowest spending in decade" },
  { year: 1945, event: "Postwar transition", note: "Growth resumes" },
  { year: 1970, event: "Inflation era", note: "Costs accelerate" },
  { year: 2008, event: "Great Recession", note: "Spending cut" },
  { year: 2020, event: "COVID-19", note: "Emergency spending spike" },
];

// ── Revenue sources (current fiscal year, USD) ──
export const revenueSources = [
  { source: "Property Tax", amount: 9800000, pct: 58, trend: "+2.1%" },
  { source: "State Aid", amount: 2400000, pct: 14, trend: "+0.5%" },
  { source: "Federal Grants", amount: 1200000, pct: 7, trend: "+12.3%" },
  { source: "Construction Fees", amount: 850000, pct: 5, trend: "+18.6%" },
  { source: "Court Fines", amount: 520000, pct: 3, trend: "-4.1%" },
  { source: "Interest Income", amount: 680000, pct: 4, trend: "+45.2%" },
  { source: "Recreation Fees", amount: 340000, pct: 2, trend: "+3.0%" },
  { source: "Other", amount: 810000, pct: 7, trend: "+1.2%" },
];

export const revenueTrend = [
  { year: "FY2020", property: 8.9, state: 2.3, other: 2.6 },
  { year: "FY2021", property: 9.1, state: 2.35, other: 2.5 },
  { year: "FY2022", property: 9.3, state: 2.38, other: 2.55 },
  { year: "FY2023", property: 9.6, state: 2.39, other: 2.6 },
  { year: "FY2024", property: 9.8, state: 2.4, other: 2.7 },
];

// ── Capital projects ──
export const capitalProjects = [
  { name: "Main Street Revitalization", dept: "Public Works", budget: 1200000, spent: 850000, status: "In Progress", start: "2024", eta: "Q3 2026" },
  { name: "Library Roof Replacement", dept: "Community Services", budget: 320000, spent: 320000, status: "Completed", start: "2023", eta: "Done" },
  { name: "Fire Station HVAC Upgrade", dept: "Public Safety", budget: 480000, spent: 210000, status: "In Progress", start: "2025", eta: "Q1 2027" },
  { name: "Centennial Park Expansion", dept: "Recreation", budget: 750000, spent: 120000, status: "Planning", start: "2025", eta: "Q4 2027" },
  { name: "Storm Drain System Upgrade", dept: "Public Works", budget: 1900000, spent: 1450000, status: "In Progress", start: "2022", eta: "Q2 2026" },
  { name: "Borough Hall IT Modernization", dept: "Administration", budget: 280000, spent: 280000, status: "Completed", start: "2024", eta: "Done" },
  { name: "Traffic Signal Network Upgrade", dept: "Public Works", budget: 540000, spent: 90000, status: "Planning", start: "2026", eta: "Q4 2027" },
];

// ── Department scorecards ──
export const departmentScorecards = [
  { department: "Public Safety", budget: 2830000, spent: 2960000, onTimePct: 92, efficiency: 78, staff: 42 },
  { department: "Public Works", budget: 1860000, spent: 1540000, onTimePct: 85, efficiency: 84, staff: 28 },
  { department: "Administration", budget: 865000, spent: 880000, onTimePct: 96, efficiency: 88, staff: 14 },
  { department: "Community Services", budget: 590000, spent: 540000, onTimePct: 90, efficiency: 91, staff: 9 },
  { department: "Recreation", budget: 340000, spent: 340000, onTimePct: 88, efficiency: 86, staff: 6 },
  { department: "Capital Projects", budget: 850000, spent: 850000, onTimePct: 72, efficiency: 70, staff: 5 },
  { department: "Utilities", budget: 220000, spent: 220000, onTimePct: 98, efficiency: 94, staff: 3 },
];

// ── Budget vs actuals (current FY, by department) ──
export const budgetVariance = [
  { department: "Public Safety", budget: 2830000, actual: 2960000 },
  { department: "Public Works", budget: 1860000, actual: 1540000 },
  { department: "Administration", budget: 865000, actual: 880000 },
  { department: "Community Services", budget: 590000, actual: 540000 },
  { department: "Recreation", budget: 340000, actual: 340000 },
  { department: "Capital Projects", budget: 850000, actual: 850000 },
  { department: "Utilities", budget: 220000, actual: 220000 },
  { department: "Debt Service", budget: 540000, actual: 540000 },
];

// ── Demographics ──
export const populationHistory = [
  { decade: "1930", population: 3800 },
  { decade: "1940", population: 4600 },
  { decade: "1950", population: 6200 },
  { decade: "1960", population: 8900 },
  { decade: "1970", population: 12500 },
  { decade: "1980", population: 13100 },
  { decade: "1990", population: 13600 },
  { decade: "2000", population: 12800 },
  { decade: "2010", population: 13800 },
  { decade: "2020", population: 14700 },
  { decade: "2026", population: 15300 },
];

export const demographics = {
  population: 15300,
  medianAge: 41.3,
  medianHouseholdIncome: 118200,
  housingUnits: 6400,
  households: 5800,
  ageDistribution: [
    { range: "0-17", pct: 22 },
    { range: "18-34", pct: 24 },
    { range: "35-54", pct: 28 },
    { range: "55-74", pct: 19 },
    { range: "75+", pct: 7 },
  ],
};

// ── Public safety ──
export const publicSafetyStats = {
  officers: 32,
  firefighters: 18,
  calls2024: 4210,
  avgResponseMin: 4.2,
  clearanceRate: 38,
  incidentsByType: [
    { type: "Traffic", count: 1820 },
    { type: "Property Crime", count: 640 },
    { type: "Domestic", count: 410 },
    { type: "Noise/Ordinance", count: 580 },
    { type: "Medical Assist", count: 490 },
    { type: "Other", count: 270 },
  ],
  callsTrend: [
    { year: "FY2020", police: 3850, fire: 980 },
    { year: "FY2021", police: 3920, fire: 1010 },
    { year: "FY2022", police: 4010, fire: 1040 },
    { year: "FY2023", police: 4140, fire: 1090 },
    { year: "FY2024", police: 4210, fire: 1120 },
  ],
};

// ── Public works ──
export const publicWorksStats = {
  roadMiles: 48,
  pavedPct: 87,
  bridges: 6,
  stormDrains: 1240,
  openWorkOrders: 47,
  avgResolutionDays: 6.4,
  infrastructure: [
    { asset: "Roads", condition: "Good", pct: 87 },
    { asset: "Sidewalks", condition: "Fair", pct: 72 },
    { asset: "Storm Drains", condition: "Good", pct: 81 },
    { asset: "Street Lights", condition: "Good", pct: 94 },
    { asset: "Traffic Signals", condition: "Fair", pct: 68 },
    { asset: "Public Buildings", condition: "Good", pct: 85 },
  ],
  workOrdersTrend: [
    { month: "Jan", opened: 38, closed: 35 },
    { month: "Feb", opened: 42, closed: 40 },
    { month: "Mar", opened: 55, closed: 48 },
    { month: "Apr", opened: 61, closed: 58 },
    { month: "May", opened: 58, closed: 60 },
    { month: "Jun", opened: 64, closed: 62 },
  ],
};

export const formatUSD = (n) =>
  n >= 1000000
    ? `$${(n / 1000000).toFixed(2)}M`
    : n >= 1000
    ? `$${(n / 1000).toFixed(1)}K`
    : `$${n.toLocaleString()}`;
