import { storageUnits, type StorageSize } from '../booking/catalog'

export const facilities = [
  { id: 'district-1', name: 'SelfStorage District 1', district: 'District 1', address: 'District 1, Ho Chi Minh City', image: '/images/storage-hero.webp', description: 'A practical space for belongings, documents and furniture when you need extra room in the city center.' },
  { id: 'thu-duc', name: 'SelfStorage Thu Duc', district: 'Thu Duc', address: 'Thu Duc, Ho Chi Minh City', image: '/images/storage-medium.webp', description: 'A range of sizes for moving, seasonal storage and business inventory.' },
]
export const sizeGuide: { size: StorageSize; area: number; title: string; use: string; items: string[]; image: string }[] = [
  { size: 'small', area: 5, title: 'Small space. Big difference.', use: 'Personal & seasonal belongings', items: ['Suitcases and boxes', 'Documents, books and clothing', 'Seasonal decorations'], image: '/images/storage-small.webp' },
  { size: 'medium', area: 10, title: 'Room for your next chapter', use: 'Furniture & apartment belongings', items: ['Tables, chairs and small shelves', 'Belongings during a move', 'Household appliances'], image: '/images/storage-medium.webp' },
  { size: 'large', area: 20, title: 'Room to grow', use: 'Large furniture & inventory', items: ['Furniture from several rooms', 'Equipment and supplies', 'Business inventory'], image: '/images/storage-hero.webp' },
]
export function startingPrice(location?: string, size?: StorageSize) {
  const units = storageUnits.filter(u => u.available && (!location || u.location === location) && (!size || u.size === size))
  return units.length ? Math.min(...units.map(u => u.monthlyPrice)) : null
}
export const faqItems = [
  { category: 'booking', question: 'How do I book a storage unit?', answer: 'Choose a facility and unit, then select a start date and rental duration. Enter your contact details, review and confirm without an account. Current bookings are browser previews and do not reserve real units.' },
  { category: 'sizes', question: 'How do I choose the right unit size?', answer: 'List your items and measure large belongings. Compare 5, 10 and 20 m² units; capacity depends on item sizes, packing and access space. Ask your facility for advice before choosing.' },
  { category: 'pricing', question: 'How are estimated costs calculated?', answer: 'Sample costs are monthly rent multiplied by the rental duration, plus a one-month deposit. Confirm final prices, taxes, fees and refund terms in your agreement.' },
  { category: 'booking', question: 'How long can I rent a unit?', answer: 'Choose between 1 and 12 months in this preview. Confirm actual rental terms and renewal availability with the facility.' },
  { category: 'access', question: 'When can I access my unit?', answer: 'Access hours and procedures vary by facility. Confirm handover times, required documents and access instructions with support. This preview does not grant facility access.' },
  { category: 'access', question: 'What can I store?', answer: 'Examples include personal belongings, furniture and inventory. Check accepted items, storage conditions and restrictions with the facility before booking.' },
  { category: 'booking', question: 'Can I cancel or change my booking?', answer: 'View and cancel preview bookings in My Bookings. Actual changes, cancellations and deposit refunds depend on your facility agreement.' },
  { category: 'pricing', question: 'Does this website collect payments?', answer: 'No payment gateway is connected. Payment actions only simulate booking status and do not create bank transactions.' },
  { category: 'access', question: 'Who can help me?', answer: 'Call 0909 149 563 for help with sizes, handover and facility requirements. Have your facility name or unit ID ready.' },
]
