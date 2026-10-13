import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { storageUnits, money } from '../../features/booking/catalog'
import { localToday, isDate } from '../../features/booking/domain'
import './customer-booking.css'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [location, setLocation] = useState(params.get('location') || '')
  const [size, setSize] = useState(params.get('size') || '')
  const [date, setDate] = useState(params.get('startDate') || localToday())
  const [months, setMonths] = useState(() => { const value = Number(params.get('months')); return Number.isInteger(value) && value >= 1 && value <= 12 ? value : 1 })
  const [error, setError] = useState('')
  const [sort, setSort] = useState('recommended')
  const units = storageUnits.filter(u => (!location || u.location === location) && (!size || u.size === size))
  if (sort !== 'recommended') units.sort((a, b) => sort === 'low' ? a.monthlyPrice - b.monthlyPrice : b.monthlyPrice - a.monthlyPrice)
  const validDate = isDate(date) && date >= localToday()
  function continueBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const unit = units.find(u => u.id === submitter?.value && u.available)
    if (!unit) { setError('Choose a storage unit to continue.'); return }
    if (!validDate) { setError('Choose a start date on or after today.'); return }
    navigate(`/customer/book/${unit.id}?startDate=${encodeURIComponent(date)}&months=${months}`)
  }
  return <div className="customer-booking">
    <div className="cb-breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>Booking</span></div>
    <section className="cb-hero"><div><span className="cb-eyebrow">BOOK STORAGE ONLINE</span><h1>More space.<br />Less stress, every day.</h1><p>Find a space for your belongings, choose your rental period and book in a few steps.</p><div className="cb-benefits"><span>✓ Flexible monthly rentals</span><span>✓ Clear costs</span><span>✓ Support when needed</span></div></div><img src="/images/storage-hero.webp" alt="Storage space for your belongings at SelfStorage" /></section>
    <ol className="cb-steps" aria-label="Booking steps"><li aria-current="step"><b>01</b><div>Choose your space<small>Unit & rental period</small></div></li><li><b>02</b><div>Customer details<small>Contact details</small></div></li><li><b>03</b><div>Confirm booking<small>Review your booking</small></div></li></ol>
    <form onSubmit={continueBooking}>
      <div className="cb-filters"><label>Location<select value={location} onChange={e => { setLocation(e.target.value) }}><option value="">All locations</option><option value="district-1">District 1, Ho Chi Minh City</option><option value="thu-duc">Thu Duc, Ho Chi Minh City</option></select></label><label>Unit size<select value={size} onChange={e => { setSize(e.target.value) }}><option value="">All sizes</option><option value="small">Small · 5 m²</option><option value="medium">Medium · 10 m²</option><option value="large">Large · 20 m²</option></select></label><label>Start date<input type="date" required min={localToday()} value={date} onChange={e => { setDate(e.target.value); setError('') }} /></label><label>Rental duration<select value={months} onChange={e => setMonths(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i === 0 ? 'month' : 'months'}</option>)}</select></label></div>
      {error && <p className="cb-error" role="alert">{error}</p>}
      <div className="cb-layout"><section aria-labelledby="cb-results"><div className="cb-results-heading"><div><h2 id="cb-results">Choose your storage unit</h2><p role="status">{units.length} matching spaces · Sample prices</p></div><label><span className="cb-sr-only">Sort units</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="recommended">Recommended</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
      <div className="cb-grid">{units.map(u => <article key={u.id} className="cb-card"><div className="cb-photo"><img src={u.image} alt={u.name} loading="lazy" /><span>{u.available ? 'Available to select' : 'Not accepting bookings'}</span></div><div className="cb-card-body"><small>{u.facility}</small><h3>{u.name}</h3><div className="cb-tags"><span>{u.area} m²</span><span>{u.type === 'cold' ? 'Cold storage' : 'Standard storage'}</span></div><p>{u.description}</p><div className="cb-card-bottom"><div><strong>{money(u.monthlyPrice)}</strong><small>/ month</small></div><button type="submit" value={u.id} disabled={!u.available}>Choose unit</button></div></div></article>)}</div>
      {!units.length && <div className="cb-empty"><h3>No matching units</h3><p>Try a different location or size.</p><button type="button" onClick={() => { setLocation(''); setSize('') }}>Clear filters</button></div>}</section>
</div>
    </form>
  </div>
}
