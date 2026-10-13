import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { User } from '../../types/auth'
import { DemoBookingStore, addMonths, localToday, signatureMatches, validateInput, type Booking, type BookingInput } from './domain'
import { money, sizeLabels, storageUnits, type StorageUnit } from './catalog'
import './booking.css'

const labels = { pending: 'Awaiting preview payment', confirmed: 'Confirmed preview', cancelled: 'Cancelled preview' }
const formatDate = (date: string) => date.split('-').reverse().join('/')
const errorText = (error: unknown) => error instanceof Error ? error.message : 'Unable to process your request. Please try again.'
// Guest orders live in a separate browser namespace; no authentication token is created.
const guestUser: User = { userId: 0, fullName: '', email: '', phoneNumber: '', role: 'StorageCustomer', status: 'Guest' }
function store() { return new DemoBookingStore({
  getItem: key => window.localStorage.getItem(`selfstorage:guest:${key}`),
  setItem: (key, value) => window.localStorage.setItem(`selfstorage:guest:${key}`, value),
}) }
function notify() { window.dispatchEvent(new Event('demo-bookings-changed')) }
export function useBookings() {
  const user = guestUser
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(() => {
    try { setBookings(user ? store().list(user.userId) : []); setError('') }
    catch (e) { setError(errorText(e)); setBookings([]) }
    setLoading(false)
  }, [user.userId])
  useEffect(() => { refresh(); window.addEventListener('storage', refresh); window.addEventListener('demo-bookings-changed', refresh); return () => { window.removeEventListener('storage', refresh); window.removeEventListener('demo-bookings-changed', refresh) } }, [refresh])
  return { bookings, error, loading, refresh, user }
}
export function DemoNotice() { return <div className="booking-demo" role="note"><strong>PREVIEW MODE</strong><span>Units, prices and terms are sample data. Bookings are saved only on this browser; no real reservations or payments are made.</span></div> }
function Shell({ children, publicPage = false }: { children: ReactNode; publicPage?: boolean }) {
  const location = useLocation()
  const isPublic = publicPage && !location.pathname.startsWith('/customer')
  const ContentTag = 'div'
  return <div className={`booking-ui ${isPublic ? 'booking-public' : ''}`}><ContentTag className="booking-content"><DemoNotice />{children}</ContentTag></div>
}
function ErrorNotice({ message, retry }: { message: string; retry?: () => void }) { return <div className="booking-error" role="alert"><p>{message}</p>{retry && <button type="button" onClick={retry}>Try again</button>}</div> }
function Loading() { return <p role="status" className="booking-loading">Loading bookings…</p> }
function UnitCard({ unit, query }: { unit: StorageUnit; query: string }) {
  return <article className="booking-unit-card"><Link to={`/storage/${unit.id}${query}`} className="booking-unit-photo"><img src={unit.image} alt={unit.name} loading="lazy" /><span className={`booking-badge ${!unit.available ? 'unavailable' : ''}`}>{unit.available ? 'Available in preview' : 'Unavailable in preview'}</span></Link><div className="booking-unit-body"><span className="booking-kicker">{unit.facility}</span><h2>{unit.name}</h2><p>{unit.address}</p><div className="booking-tags"><span>{unit.area} m²</span><span>{unit.type === 'cold' ? 'Cold storage' : 'Standard storage'}</span></div><p>{unit.description}</p><div className="booking-card-bottom"><div><strong>{money(unit.monthlyPrice)}</strong><small>/ month · sample price</small></div><Link className="booking-button secondary" to={`/storage/${unit.id}${query}`}>Xem kho →</Link></div></div></article>
}
export function BrowseStoragePage() {
  const [params, setParams] = useSearchParams()
  const location = params.get('location') || ''
  const size = params.get('size') || ''
  const type = params.get('type') || ''
  const startDate = params.get('startDate') || ''
  const availableOnly = params.get('available') === '1'
  const sort = params.get('sort') || ''
  const filtered = storageUnits.filter(unit => (!location || unit.location === location) && (!size || unit.size === size) && (!type || unit.type === type) && (!availableOnly || unit.available))
  if (sort) filtered.sort((a, b) => sort === 'price-desc' ? b.monthlyPrice - a.monthlyPrice : a.monthlyPrice - b.monthlyPrice)
  function change(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }) }
  const query = startDate ? `?startDate=${encodeURIComponent(startDate)}` : ''
  return <Shell publicPage><div className="booking-heading"><span className="booking-kicker">SPACE FOR YOUR NEXT CHAPTER</span><h1>Find your storage</h1><p>Choose a location, size and start date to explore preview units.</p></div><div className="booking-filters"><label>Location<select value={location} onChange={e => change('location', e.target.value)}><option value="">All locations</option><option value="district-1">District 1</option><option value="thu-duc">Thu Duc</option></select></label><label>Size<select value={size} onChange={e => change('size', e.target.value)}><option value="">All sizes</option><option value="small">Small · 5 m²</option><option value="medium">Medium · 10 m²</option><option value="large">Large · 20 m²</option></select></label><label>Unit type<select value={type} onChange={e => change('type', e.target.value)}><option value="">All unit types</option><option value="standard">Standard</option><option value="cold">Cold storage</option></select></label><label>Start date<input type="date" value={startDate} min={localToday()} onChange={e => change('startDate', e.target.value)} onInput={e => change('startDate', e.currentTarget.value)} /></label></div><div className="booking-results-bar"><span role="status">{filtered.length} matching preview units</span><label className="booking-checkbox"><input type="checkbox" checked={availableOnly} onChange={e => change('available', e.target.checked ? '1' : '')} />Available preview units only</label><label className="booking-sort">Sort<select value={sort} onChange={e => change('sort', e.target.value)}><option value="">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div>{filtered.length ? <div className="booking-unit-grid">{filtered.map(unit => <UnitCard key={unit.id} unit={unit} query={query} />)}</div> : <div className="booking-empty"><h2>No units match your filters</h2><p>Try a different location, size or unit type.</p><button className="booking-button secondary" onClick={() => setParams({})}>Clear filters</button></div>}</Shell>
}
export function StorageDetailsPage() {
  const { unitId } = useParams()
  const [params] = useSearchParams()
  const unit = storageUnits.find(u => u.id === unitId)
  if (!unit) return <Shell publicPage><div className="booking-empty"><h1>Unit not found</h1><Link className="booking-button" to="/storage">Back to units</Link></div></Shell>
  const query = params.get('startDate') ? `?startDate=${encodeURIComponent(params.get('startDate')!)}` : ''
  return <Shell publicPage><Link className="booking-back" to={`/storage${query}`}>← All units</Link><div className="booking-detail-grid"><img className="booking-detail-image" src={unit.image} alt={unit.name} /><div className="booking-detail-copy"><span className="booking-kicker">{unit.facility}</span><h1>{unit.name}</h1><p>{unit.address}</p><div className="booking-tags"><span>{unit.area} m²</span><span>{sizeLabels[unit.size]}</span><span>{unit.type === 'cold' ? 'Cold storage' : 'Standard'}</span></div><p>{unit.description}</p><div className="booking-price"><strong>{money(unit.monthlyPrice)}</strong><span>/ month · preview price</span></div><ul><li>Preview rental periods: 1–12 months.</li><li>Sample deposit: one month of rent.</li><li>Actual prices and terms require confirmation from the facility.</li></ul>{unit.available ? <Link className="booking-button" to={`/customer/book/${unit.id}${query}`}>Choose unit & book →</Link> : <p className="booking-unavailable">This unit is unavailable in the preview catalog.</p>}<p className="booking-small">You can book without an account.</p></div></div><section className="booking-panel"><h2>Before you book</h2><p>Images and sizes are illustrative. Confirm restricted items and special storage requirements with the facility. Access instructions, handover and official contracts are not connected in this preview.</p></section></Shell>
}
export function BookingCheckoutPage() {
  const { unitId } = useParams()
  const user = guestUser
  const unit = storageUnits.find(u => u.id === unitId)
  if (!unit || !unit.available || !user) return <Shell><div className="booking-empty"><h1>Unit unavailable</h1><Link to="/storage" className="booking-button">Choose another unit</Link></div></Shell>
  return <CheckoutForm key={`${user.userId}:${unit.id}`} user={user} unit={unit} />
}
function CheckoutForm({ user, unit }: { user: User; unit: StorageUnit }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const key = `selfstorage:guest-draft:${unit.id}`
  const [draftWarning, setDraftWarning] = useState('')
  const [input, setInput] = useState<BookingInput>(() => {
    const defaults: BookingInput = { requestId: crypto.randomUUID(), unitId: unit.id, startDate: params.get('startDate') || localToday(), months: Math.min(12, Math.max(1, Number(params.get('months')) || 1)), fullName: user.fullName, email: user.email, phone: user.phoneNumber || '', notes: '', accepted: false }
    try {
      const raw = sessionStorage.getItem(key)
      if (!raw) return defaults
      const saved = JSON.parse(raw) as Partial<BookingInput>
      if (saved.unitId !== unit.id || typeof saved.requestId !== 'string') return defaults
      return { ...defaults, startDate: params.get('startDate') || (typeof saved.startDate === 'string' ? saved.startDate : defaults.startDate), months: params.has('months') ? defaults.months : Number.isInteger(saved.months) && saved.months! >= 1 && saved.months! <= 12 ? saved.months! : 1,
        requestId: saved.requestId, fullName: typeof saved.fullName === 'string' ? saved.fullName : defaults.fullName, email: typeof saved.email === 'string' ? saved.email : defaults.email,
        phone: typeof saved.phone === 'string' ? saved.phone : defaults.phone, notes: typeof saved.notes === 'string' ? saved.notes : '', accepted: false }
    } catch { return defaults }
  })
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const guard = useRef(false)
  const errorRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [signedName, setSignedName] = useState('')
  useEffect(() => { try { sessionStorage.setItem(key, JSON.stringify(input)) } catch { setDraftWarning('Unable to save your draft. Keep this page open until you finish.') } }, [input, key])
  useEffect(() => { if (Object.keys(errors).length || error) errorRef.current?.focus() }, [errors, error])
  useEffect(() => { headingRef.current?.focus() }, [step])
  let endDate = ''
  try { endDate = addMonths(input.startDate, input.months) } catch { /* Inline validation is shown on continue. */ }
  function update<K extends keyof BookingInput>(key: K, value: BookingInput[K]) { setInput(prev => ({ ...prev, [key]: value, accepted: key === 'accepted' ? Boolean(value) : false })); if (key !== 'accepted') setSignedName(''); setErrors(prev => { const next = { ...prev }; delete next[key]; return next }); setError('') }
  function validateField(key: string) { const all = validateInput(input); setErrors(prev => { const next = { ...prev }; if (all[key]) next[key] = all[key]; else delete next[key]; return next }) }
  function continueStep(event: FormEvent) {
    event.preventDefault()
    const all = validateInput(input)
    const fields = step === 0 ? ['startDate', 'months'] : step === 1 ? ['fullName', 'email', 'phone', 'notes'] : Object.keys(all)
    const current = Object.fromEntries(Object.entries(all).filter(([key]) => fields.includes(key)))
    if (step === 2 && !signatureMatches(signedName, input.fullName)) current.signature = 'Enter a signing name that matches the renter full name.'
    setErrors(current)
    if (Object.keys(current).length) return
    if (step < 2) { setStep(step + 1); return }
    if (guard.current) return
    guard.current = true; setBusy(true); setError('')
    try {
      const booking = store().create(user.userId, { ...input, contract: { version: 'storage-preview-v1', signedName: signedName.trim(), signedAt: new Date().toISOString() } }, unit)
      notify()
      try { sessionStorage.removeItem(key) } catch { /* Booking is already saved; a draft cleanup failure must not create a failed checkout. */ }
      navigate(`/customer/bookings/${encodeURIComponent(booking.id)}`, { replace: true })
    } catch (e) { setError(errorText(e)); guard.current = false; setBusy(false) }
  }
  const field = (key: 'fullName' | 'email' | 'phone', label: string, type = 'text') => <label className="booking-field" htmlFor={`booking-${key}`}>{label}<input id={`booking-${key}`} aria-label={label} type={type} autoComplete={key === 'fullName' ? 'name' : key === 'phone' ? 'tel' : 'email'} value={input[key]} maxLength={key === 'fullName' ? 100 : key === 'phone' ? 20 : 254} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} onBlur={() => validateField(key)} onChange={e => update(key, e.target.value)} />{errors[key] && <small id={`error-${key}`} className="booking-field-error">{errors[key]}</small>}</label>
  return <Shell><Link className="booking-back" to={`/storage/${unit.id}`}>← Unit details</Link><div className="booking-heading"><span className="booking-kicker">STORAGE BOOKING PREVIEW</span><h1>More space. Less stress.</h1><p>Review your details before submitting a preview booking.</p></div><ol className="booking-progress" aria-label="Booking progress">{['Rental duration', 'Contact details', 'Review & Confirm'].map((label, i) => <li key={label} className={i <= step ? 'active' : ''} aria-current={i === step ? 'step' : undefined}><span>{i < step ? '✓' : i + 1}</span>{label}</li>)}</ol><div className="booking-checkout-content"><form className="booking-panel booking-form" noValidate onSubmit={continueStep}><h2 ref={headingRef} tabIndex={-1}>{['Choose rental dates', 'Renter details', 'Review your booking'][step]}</h2>{draftWarning && <p className="booking-small" role="status">{draftWarning}</p>}{(error || Object.keys(errors).length > 0) && <div ref={errorRef} className="booking-error" tabIndex={-1} role="alert"><strong>Please review your details</strong>{error && <p>{error}</p>}<ul>{Object.entries(errors).map(([key, message]) => <li key={key}><a href={`#booking-${key}`}>{message}</a></li>)}</ul></div>}
    {step === 0 && <><label className="booking-field" htmlFor="booking-startDate">Start date<input id="booking-startDate" aria-label="Start date" type="date" min={localToday()} value={input.startDate} aria-invalid={!!errors.startDate} aria-describedby={errors.startDate ? 'error-startDate' : undefined} onBlur={() => validateField('startDate')} onChange={e => update('startDate', e.target.value)} onInput={e => update('startDate', e.currentTarget.value)} />{errors.startDate && <small id="error-startDate" className="booking-field-error">{errors.startDate}</small>}</label><label className="booking-field" htmlFor="booking-months">Rental duration<select id="booking-months" value={input.months} onChange={e => update('months', Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => <option value={i + 1} key={i}>{i + 1} {i === 0 ? 'month' : 'months'}</option>)}</select>{errors.months && <small className="booking-field-error">{errors.months}</small>}</label>{endDate && <p className="booking-callout">Rental from <strong>{formatDate(input.startDate)}</strong> until before <strong>{formatDate(endDate)}</strong>. Preview rentals use calendar months rather than 30-day periods.</p>}<p className="booking-small">Your details are saved in this browser session so you can continue after reloading.</p></>}
    {step === 1 && <>{field('fullName', 'Full name')}{field('email', 'Email', 'email')}{field('phone', 'Phone number', 'tel')}<label className="booking-field" htmlFor="booking-notes">Notes (optional)<textarea id="booking-notes" value={input.notes} maxLength={500} rows={3} onChange={e => update('notes', e.target.value)} /><small>{input.notes.length}/500 characters. Do not enter card details or sensitive information.</small></label></>}
    {step === 2 && <><dl className="booking-review"><div><dt>Unit</dt><dd>{unit.name} · {unit.facility}</dd></div><div><dt>Period</dt><dd>{formatDate(input.startDate)} – {formatDate(endDate)} ({input.months} {input.months === 1 ? 'month' : 'months'})</dd></div><div><dt>Renter</dt><dd>{input.fullName}</dd></div><div><dt>Contact</dt><dd>{input.email}<br />{input.phone}</dd></div>{input.notes && <div><dt>Notes</dt><dd>{input.notes}</dd></div>}</dl><section className="booking-contract" aria-labelledby="contract-title"><div className="booking-contract-heading"><div><span className="booking-kicker">STORAGE AGREEMENT · PREVIEW</span><h3 id="contract-title">Rental Agreement & Signature</h3></div><span className="booking-contract-status">{input.accepted && signatureMatches(signedName, input.fullName) ? 'Ready to confirm' : 'Awaiting signature'}</span></div><p className="booking-small">A preview agreement for this booking flow. Signatures are saved in this browser; no electronic signing service or official contract is connected.</p><div className="booking-contract-document"><h4>Storage agreement — preview version 1.0</h4><p><strong>Renter:</strong> {input.fullName}<br /><strong>Facility:</strong> {unit.facility}<br /><strong>Unit:</strong> {unit.name} · {unit.area} m²<br /><strong>Rental period:</strong> {formatDate(input.startDate)} until before {formatDate(endDate)} · {input.months} {input.months === 1 ? 'month' : 'months'}</p><ol><li><strong>Rental purpose:</strong> use the storage space according to the selected unit and rental period.</li><li><strong>Sample costs:</strong> monthly rent {money(unit.monthlyPrice)} / month; the sample deposit is one month of rent. Confirm final prices, taxes, fees and deposit terms with the facility.</li><li><strong>Using the unit:</strong> confirm accepted items, storage conditions, access hours and handover with the facility.</li><li><strong>Changes or termination:</strong> renewal, cancellation and refund terms will follow the official agreement provided later.</li><li><strong>Preview scope:</strong> bookings and signatures are stored locally. No real reservations, payments or access rights are created.</li></ol></div><label className="booking-field" htmlFor="booking-signature">Signer full name<input id="booking-signature" value={signedName} maxLength={100} autoComplete="name" placeholder="Enter the renter full name" aria-invalid={!!errors.signature} aria-describedby="signature-hint signature-error" onChange={e => { setSignedName(e.target.value); setInput(prev => ({ ...prev, accepted: false })); setErrors(prev => { const next = { ...prev }; delete next.signature; delete next.accepted; return next }) }} /><small id="signature-hint">Enter the same full name as the renter to sign this preview agreement.</small>{errors.signature && <small id="signature-error" className="booking-field-error">{errors.signature}</small>}</label>{signedName.trim() && <div className="booking-signature-preview"><span className="booking-small">Typed signature</span><strong>{signedName.trim()}</strong></div>}<label className="booking-checkbox" htmlFor="booking-accepted"><input id="booking-accepted" type="checkbox" checked={input.accepted} onChange={e => update('accepted', e.target.checked)} aria-invalid={!!errors.accepted} aria-describedby={errors.accepted ? 'accepted-error' : undefined} />I have read the agreement, confirm my typed signature and understand that this is a preview booking.</label>{errors.accepted && <p id="accepted-error" className="booking-field-error">{errors.accepted}</p>}</section></>}
    <div className="booking-form-actions">{step > 0 && <button disabled={busy} className="booking-button secondary" type="button" onClick={() => { setStep(step - 1); setErrors({}); setError('') }}>Back</button>}<button className="booking-button" type="submit" disabled={busy}>{busy ? 'Saving booking…' : step === 2 ? 'Confirm preview booking' : 'Continue →'}</button></div></form></div></Shell>
}
export function CustomerBookingsPage() {
  const { bookings, error, loading, refresh } = useBookings()
  const [status, setStatus] = useState('')
  const filtered = bookings.filter(b => !status || b.status === status)
  return <Shell><div className="booking-heading booking-heading-row"><div><span className="booking-kicker">YOUR SPACE</span><h1>My Bookings</h1><p>Track your bookings and preview payment status.</p></div><Link className="booking-button" to="/storage">Book another unit →</Link></div><label className="booking-status-filter">Status<select value={status} onChange={e => setStatus(e.target.value)}><option value="">All bookings</option>{Object.entries(labels).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>{loading ? <Loading /> : error ? <ErrorNotice message={error} retry={refresh} /> : filtered.length ? <div className="booking-order-list">{filtered.map(booking => <BookingCard key={booking.id} booking={booking} />)}</div> : <div className="booking-empty"><h2>{bookings.length ? 'No bookings with this status' : 'No preview bookings yet'}</h2><p>Explore preview units and create your first booking.</p><Link className="booking-button" to="/storage">Find your storage</Link></div>}</Shell>
}
function BookingCard({ booking }: { booking: Booking }) {
  const unit = storageUnits.find(u => u.id === booking.unitId)
  return <article className="booking-order"><img src={unit?.image || '/images/storage-hero.webp'} alt={unit?.name || booking.unitId} /><div><span className={`booking-status ${booking.status}`}>{labels[booking.status]}</span><h2>{unit?.name || booking.unitId}</h2><p>{unit?.facility}</p><p>{formatDate(booking.startDate)} – {formatDate(booking.endDate)} · {booking.months} {booking.months === 1 ? 'month' : 'months'}</p><small>Booking ID: {booking.id}</small></div><div className="booking-order-action"><strong>{money(booking.total)}</strong><small>Preview total</small><Link className="booking-button secondary" to={`/customer/bookings/${encodeURIComponent(booking.id)}`}>View booking →</Link></div></article>
}
export function BookingConfirmationPage() {
  const { bookingId } = useParams()
  const { bookings, user, error: loadError, loading, refresh } = useBookings()
  const booking = bookings.find(b => b.id === bookingId)
  const unit = storageUnits.find(u => u.id === booking?.unitId)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const cancelDialog = useRef<HTMLDialogElement>(null)
  const guard = useRef(false)
  useEffect(() => { if (cancelOpen) cancelDialog.current?.showModal() }, [cancelOpen])
  function action(kind: 'pay' | 'cancel') {
    if (!booking || !user || guard.current) return
    guard.current = true; setBusy(true); setError('')
    try { if (kind === 'pay') store().pay(user.userId, booking.id); else store().cancel(user.userId, booking.id); notify(); refresh(); setCancelOpen(false); setPaymentOpen(false) }
    catch (e) { setError(errorText(e)) }
    finally { guard.current = false; setBusy(false) }
  }
  if (loading) return <Shell><Loading /></Shell>
  if (loadError) return <Shell><ErrorNotice message={loadError} retry={refresh} /></Shell>
  if (!booking || !unit) return <Shell><div className="booking-empty"><h1>Booking not found on this browser</h1><Link className="booking-button" to="/customer/units">Back to bookings</Link></div></Shell>
  return <Shell><Link className="booking-back" to="/customer/units">← My Bookings</Link><div className="booking-heading"><span className="booking-kicker">{booking.status === 'cancelled' ? 'PREVIEW BOOKING CANCELLED' : booking.status === 'confirmed' ? 'PREVIEW COMPLETE' : 'PREVIEW BOOKING SAVED'}</span><h1>{booking.status === 'confirmed' ? 'Preview booking confirmed!' : booking.status === 'cancelled' ? 'Your booking has been cancelled.' : 'Your booking has been saved.'}</h1><p>{booking.status === 'pending' ? 'Next step: simulate payment to confirm your preview booking.' : 'This status only applies to the browser preview.'}</p></div>{error && <ErrorNotice message={error} />}<div className="booking-checkout-grid"><div className="booking-panel"><span className={`booking-status ${booking.status}`}>{labels[booking.status]}</span><h2>{unit.name} · {unit.facility}</h2>{booking.contract && <section className="booking-contract"><span className="booking-kicker">SIGNED AGREEMENT · PREVIEW</span><h3>Signature saved</h3><p>Signed by: <strong>{booking.contract.signedName}</strong><br />Signed at: {new Date(booking.contract.signedAt).toLocaleString('en-GB')}<br />Version: 1.0</p><p className="booking-small">Your typed signature is saved with this booking on this browser.</p></section>}<dl className="booking-review"><div><dt>Booking ID</dt><dd className="booking-code">{booking.id}</dd></div><div><dt>Start date</dt><dd>{formatDate(booking.startDate)}</dd></div><div><dt>End date (exclusive)</dt><dd>{formatDate(booking.endDate)}</dd></div><div><dt>Duration</dt><dd>{booking.months} {booking.months === 1 ? 'month' : 'months'}</dd></div><div><dt>Renter</dt><dd>{booking.fullName}</dd></div><div><dt>Contact</dt><dd>{booking.email}<br />{booking.phone}</dd></div>{booking.notes && <div><dt>Notes</dt><dd>{booking.notes}</dd></div>}</dl>{booking.status === 'confirmed' && <div className="booking-callout success"><strong>Payment simulation complete.</strong><p>No real transaction was made. The facility will provide handover and access instructions when connected. This preview does not issue PINs or access rights.</p></div>}{booking.status !== 'cancelled' && <div className="booking-form-actions">{booking.status === 'pending' && <button className="booking-button" onClick={() => setPaymentOpen(true)}>Simulate payment</button>}<button className="booking-text-button danger" disabled={busy} onClick={() => setCancelOpen(true)}>Cancel preview booking</button></div>}<Link className="booking-text-button" to="/storage">Continue exploring →</Link></div><aside className="booking-panel booking-summary"><img src={unit.image} alt={unit.name} /><h2>Preview costs</h2><dl><div><dt>Rent</dt><dd>{money(booking.rentalTotal)}</dd></div><div><dt>Sample deposit</dt><dd>{money(booking.deposit)}</dd></div><div className="booking-total"><dt>Total</dt><dd>{money(booking.total)}</dd></div></dl>{booking.paymentId && <p className="booking-small">Preview payment ID: <span className="booking-code">{booking.paymentId}</span></p>}{paymentOpen && booking.status === 'pending' && <div className="booking-payment"><h3>Confirm payment simulation</h3><p>This only updates preview booking status. No card details or money transfers are required.</p><button className="booking-button" disabled={busy} onClick={() => action('pay')}>{busy ? 'Processing…' : 'Simulate successful payment'}</button><button className="booking-text-button" onClick={() => setPaymentOpen(false)}>Later</button></div>}<Link className="booking-text-button" to="/customer/payments">Payment history →</Link></aside></div>{cancelOpen && <dialog ref={cancelDialog} className="booking-dialog" aria-labelledby="cancel-title" onCancel={() => setCancelOpen(false)}><h2 id="cancel-title">Cancel this preview booking?</h2><p>The cancelled booking stays in your history. No real money is collected or refunded. The unit can be booked again in this preview.</p><div className="booking-form-actions"><button autoFocus className="booking-button secondary" onClick={() => setCancelOpen(false)}>Keep booking</button><button disabled={busy} className="booking-button danger-button" onClick={() => action('cancel')}>{busy ? 'Cancelling…' : 'Confirm cancellation'}</button></div>{error && <ErrorNotice message={error} />}</dialog>}</Shell>
}
export function CustomerPaymentsPage() {
  const { bookings, loading, error, refresh } = useBookings()
  const paid = bookings.filter(b => b.paymentId)
  return <Shell><div className="booking-heading"><span className="booking-kicker">PREVIEW HISTORY</span><h1>My Payments</h1><p>No bank transactions or real payments are made in this preview.</p></div>{loading ? <Loading /> : error ? <ErrorNotice message={error} retry={refresh} /> : paid.length ? <div className="booking-panel booking-table-wrap"><table className="booking-table"><caption>Payment simulations</caption><thead><tr><th>Payment ID</th><th>Date</th><th>Sample amount</th><th>Booking status</th><th>Details</th></tr></thead><tbody>{paid.map(b => <tr key={b.id}><td className="booking-code">{b.paymentId}</td><td>{new Date(b.paidAt!).toLocaleDateString('en-GB')}</td><td>{money(b.total)}</td><td>{labels[b.status]}</td><td><Link to={`/customer/bookings/${encodeURIComponent(b.id)}`}>View booking</Link></td></tr>)}</tbody></table><p className="booking-small">Cancelled bookings retain their simulated transactions. No actual refunds are processed.</p></div> : <div className="booking-empty"><h2>No payment simulations yet</h2><p>Open a pending booking to continue.</p><Link className="booking-button" to="/customer/units">View my bookings</Link></div>}</Shell>
}
export function CustomerBookingDashboard() {
  const { bookings, user, loading, error, refresh } = useBookings()
  const active = bookings.filter(b => b.status !== 'cancelled')
  return <Shell><div className="booking-dashboard-hero"><span className="booking-kicker">SELFSTORAGE · YOUR SPACE</span><h1>Hello, {user?.fullName || 'there'}.</h1><p>Find your space and follow your booking journey in one place.</p><Link className="booking-button" to="/storage">Find & book storage →</Link></div><div className="booking-stats"><div><span>Active bookings</span><strong>{active.length}</strong></div><div><span>Awaiting preview payment</span><strong>{active.filter(b => b.status === 'pending').length}</strong></div><div><span>Confirmed preview</span><strong>{active.filter(b => b.status === 'confirmed').length}</strong></div><div><span>Total simulated payments</span><strong>{money(bookings.filter(b => b.paymentId).reduce((sum, b) => sum + b.total, 0))}</strong></div></div><div className="booking-heading-row"><h2>Recent bookings</h2><Link className="booking-text-button" to="/customer/units">View all →</Link></div>{loading ? <Loading /> : error ? <ErrorNotice message={error} retry={refresh} /> : bookings.length ? <div className="booking-order-list">{bookings.slice(0, 3).map(b => <BookingCard key={b.id} booking={b} />)}</div> : <div className="booking-empty"><h2>A little space for your next chapter.</h2><p>No preview bookings yet. Start by choosing a unit.</p><Link className="booking-button" to="/storage">Explore preview units</Link></div>}</Shell>
}

