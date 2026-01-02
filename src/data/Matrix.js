// fallback mockRecords used for prototypes and demos
const mockRecords = [
  { id: 'm1', asset: 'Server and Host', vulnerability: 'NO FIREWALL', impact: 'System and data breach', threats: 'External Threats, Hackers', severity: 'Intolerable', likelihood: 'Probable', riskLevel: 'EXTREME' },
  { id: 'm2', asset: 'Database', vulnerability: 'NO BACKUP', impact: 'System and data breach', threats: 'External Threats, Hackers', severity: 'Undesirable', likelihood: 'Possible', riskLevel: 'HIGH' },
  { id: 'm3', asset: 'Software', vulnerability: 'Unpatched Software Versions', impact: 'System and data breach', threats: 'External Threats, Hackers', severity: 'Undesirable', likelihood: 'Probable', riskLevel: 'HIGH' },
  { id: 'm4', asset: 'Network Stability', vulnerability: 'Intermittent Packet Loss', impact: 'Slow response to internet outages', threats: 'Employee maintenance lapses, ISP issues', severity: 'Tolerable', likelihood: 'Possible', riskLevel: 'MEDIUM' }
];

// assets dropdown should exclude working hours (per request)
// Normalize asset names: convert any 'Workstation' entry to 'Software'
// Ensure 'Network Stability' is always available in the assets list for testing
const assets = Array.from(new Set(
  mockRecords
    .map(r => (r.asset === 'Workstation' ? 'Software' : r.asset))
    .concat(['Network Stability'])
));

// risk matrix mapping: severity x likelihood -> level
// severity: Acceptable, Tolerable, Undesirable, Intolerable
// likelihood: Improbable, Possible, Probable
// Values: LOW, MEDIUM, HIGH, EXTREME
const riskMatrix = {
  Improbable: {
    Acceptable: 'LOW',
    Tolerable: 'MEDIUM',
    Undesirable: 'MEDIUM',
    Intolerable: 'HIGH'
  },
  Possible: {
    Acceptable: 'LOW',
    Tolerable: 'MEDIUM',
    Undesirable: 'HIGH',
    Intolerable: 'EXTREME'
  },
  Probable: {
    Acceptable: 'MEDIUM',
    Tolerable: 'HIGH',
    Undesirable: 'HIGH',
    Intolerable: 'EXTREME'
  }
};

export { mockRecords, assets, riskMatrix };
