// Read legacy demo records without changing names or user-authored content.
const legacyLabels: Record<string, string> = {
  "\u0110ang ho\u1ea1t \u0111\u1ed9ng": "Operating",
  "T\u1ea1m ng\u1eebng ho\u1ea1t \u0111\u1ed9ng": "Temporarily closed",
  "Kh\u00e1ch y\u00eau c\u1ea7u h\u1ed7 tr\u1ee3 m\u1edf kho": "Customer requests help unlocking a unit",
  "\u0110\u1ec1 ngh\u1ecb mi\u1ec5n ph\u00ed ph\u00e1t sinh v\u01b0\u1ee3t quy\u1ec1n Staff": "Fee waiver request requiring manager approval",
  "Ch\u1edd ph\u00e2n c\u00f4ng": "Awaiting assignment",
  "Ch\u1edd ph\u00ea duy\u1ec7t": "Awaiting approval",
  "\u0110\u00e3 ph\u00ea duy\u1ec7t": "Approved",
  "T\u1eeb ch\u1ed1i": "Rejected",
  "\u0110ang x\u1eed l\u00fd": "In progress",
  "B\u00e0n giao & h\u1ed7 tr\u1ee3 kh\u00e1ch": "Handovers & customer support",
  "Ki\u1ec3m tra & b\u1ea3o tr\u00ec": "Inspections & maintenance",
  "H\u1ed7 tr\u1ee3 h\u1ee3p \u0111\u1ed3ng": "Contract support",
  "Ki\u1ec3m tra c\u01a1 s\u1edf \u0111\u1ea7u ca": "Start-of-shift facility inspection",
  "T\u1ea7ng 1 \u00b7 Khu A": "Floor 1 \u00b7 Zone A",
  "T\u1ea7ng 2 \u00b7 Khu B": "Floor 2 \u00b7 Zone B",
  "Ch\u1edd b\u00e0n giao": "Awaiting handover",
  "Ch\u1edd thanh to\u00e1n": "Pending payment",
  "\u0110\u00e3 thanh to\u00e1n": "Paid",
  "Ch\u1edd th\u1ef1c hi\u1ec7n": "Pending",
  "\u0110ang th\u1ef1c hi\u1ec7n": "In progress",
  "Ho\u00e0n th\u00e0nh": "Completed",
  "\u0110\u00e3 tr\u1ea3": "Returned",
  "C\u00f2n tr\u1ed1ng": "Available",
  "\u0110ang thu\u00ea": "Occupied",
  "B\u1ea3o tr\u00ec": "Maintenance",
  "V\u00f4 hi\u1ec7u h\u00f3a": "Deactivated",
  "Ca s\u00e1ng \u00b7 08:00 \u2013 14:00": "Morning shift \u00b7 08:00 \u2013 14:00",
  "Ca chi\u1ec1u \u00b7 14:00 \u2013 20:00": "Afternoon shift \u00b7 14:00 \u2013 20:00",
  "Ngh\u1ec9": "Off duty"
}
export function parseManagerData(raw: string) {
  return JSON.parse(raw, (_key, value) => typeof value === 'string' ? legacyLabels[value] ?? value : value)
}
