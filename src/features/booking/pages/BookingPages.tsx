import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { User } from '../../auth/types/auth'
import { DemoBookingStore, addMonths, isDate, isRentalDuration, rentalDurations, localToday, signatureMatches, validateInput, type Booking, type BookingInput } from '../model/domain'
import { money, sizeLabels, storageUnits, type StorageUnit } from '../model/catalog'

const styles = {
  error: 'rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5',
  tags: 'mt-3 flex flex-wrap gap-1.5 [&_span]:rounded border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700',
  button: 'inline-flex min-h-[46px] items-center justify-center rounded-lg border border-transparent bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-55',
  buttonSecondary: 'inline-flex min-h-[46px] items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-55',
  checkbox: 'flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed [&_input]:mt-0.5 [&_input]:h-[18px] [&_input]:w-[18px] [&_input]:shrink-0 [&_input]:accent-blue-600',
  empty: 'rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center [&_p]:mt-3 [&_p]:mb-6 [&_p]:text-sm [&_p]:text-slate-500',
  panel: 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 [&>h2]:mb-5 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-slate-500',
  field: 'flex flex-col gap-2 text-xs font-semibold [&_small]:text-[10px] [&_small]:font-normal [&_small]:text-slate-500',
  callout: 'rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs leading-relaxed text-blue-800',
  calloutSuccess: 'rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-800',
  review: 'my-5 [&>div]:grid [&>div]:grid-cols-[100px_1fr] [&>div]:gap-3 [&>div]:border-b [&>div]:border-slate-100 [&>div]:py-3 [&>div]:text-xs sm:[&>div]:grid-cols-[160px_1fr] [&_dt]:text-slate-500 [&_dd]:m-0 [&_dd]:break-words [&_dd]:font-medium [&_dd]:whitespace-pre-wrap',
  status: 'inline-block rounded border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-800',
  statusConfirmed: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  statusCancelled: 'border-slate-200 bg-slate-100 text-slate-600',
  textBtn: 'mt-3 inline-block text-left text-xs font-semibold text-blue-600 hover:underline',
  textBtnDanger: 'mt-3 inline-block text-left text-xs font-semibold text-red-700 hover:underline',
  kicker: 'text-[10px] font-bold tracking-wider text-blue-600',
  back: 'mb-5 mt-1 inline-block text-xs text-blue-600',
  heading: 'mb-7 mt-6 [&_h1]:my-2.5 [&_p]:text-sm [&_p]:text-slate-500',
  input: 'min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-900 aria-[invalid=true]:border-red-600',
} as const

const labels = { pending: 'Awaiting preview payment', confirmed: 'Confirmed preview', cancelled: 'Cancelled preview' } as const
const formatDate = (date: string) => date.split('-').reverse().join('/')
const errorText = (e: unknown) => (e instanceof Error ? e.message : 'Unable to process your request. Please try again.')
const guestUser: User = { userId: 0, fullName: '', email: '', phoneNumber: '', role: 'StorageCustomer', status: 'Guest' }

function store() {
  return new DemoBookingStore({
    getItem: (k) => window.localStorage.getItem(`selfstorage:guest:${k}`),
    setItem: (k, v) => window.localStorage.setItem(`selfstorage:guest:${k}`, v),
  })
}
function notify() { window.dispatchEvent(new Event('demo-bookings-changed')) }
function statusClass(s: Booking['status']) {
  return s === 'confirmed' ? styles.statusConfirmed : s === 'cancelled' ? styles.statusCancelled : ''
}

export function useBookings() {
  const user = guestUser
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const refresh = useCallback(() => {
    try { setBookings(store().list(user.userId)); setError('') }
    catch (e) { setError(errorText(e)); setBookings([]) }
    setLoading(false)
  }, [user.userId])
  useEffect(() => {
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('demo-bookings-changed', refresh)
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('demo-bookings-changed', refresh) }
  }, [refresh])
  return { bookings, error, loading, refresh, user }
}

export function DemoNotice() {
  return (
    <div role="note" className="mb-6 flex flex-col gap-1 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-800 sm:flex-row sm:items-center sm:gap-3">
      <strong className="text-[10px] tracking-wider">PREVIEW MODE</strong>
      <span>Units, prices and terms are sample data. Bookings are saved only on this browser; no real reservations or payments are made.</span>
    </div>
  )
}

function Shell({ children, publicPage = false }: { children: ReactNode; publicPage?: boolean }) {
  const location = useLocation()
  const isPublic = publicPage && !location.pathname.startsWith('/customer')
  return (
    <div className={`font-sans text-sm leading-relaxed text-slate-900 [&_a]:no-underline [&_button]:cursor-pointer [&_img]:block [&_img]:object-cover ${isPublic ? 'min-h-screen bg-slate-50' : ''}`}>
      <div className={`mx-auto w-full ${isPublic ? 'max-w-[1200px] px-5 py-6 sm:px-6 sm:pb-16 sm:pt-8' : ''}`}>
        <DemoNotice />{children}
      </div>
    </div>
  )
}

function ErrorNotice({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className={styles.error} role="alert">
      <p>{message}</p>
      {retry && <button type="button" className="mt-2 font-semibold underline" onClick={retry}>Try again</button>}
    </div>
  )
}

function Loading() {
  return <p role="status" className="p-10 text-center text-slate-500">Loading bookings…</p>
}

function UnitCard({ unit, query }: { unit: StorageUnit; query: string }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/storage/${unit.id}${query}`} className="relative block h-[210px] overflow-hidden max-[680px]:h-[220px]">
        <img src={unit.image} alt={unit.name} loading="lazy" className="h-full w-full transition duration-300 hover:scale-[1.035] motion-reduce:hover:scale-100" />
        <span className={`absolute left-3.5 top-3.5 rounded bg-white px-2.5 py-1 text-[10px] font-semibold ${unit.available ? 'text-emerald-700' : 'text-slate-600'}`}>
          {unit.available ? 'Available in preview' : 'Unavailable in preview'}
        </span>
      </Link>
      <div className="p-5">
        <span className={styles.kicker}>{unit.facility}</span>
        <h2 className="my-1.5 text-lg font-semibold">{unit.name}</h2>
        <p className="text-xs text-slate-500">{unit.address}</p>
        <div className={styles.tags}><span>{unit.area} m²</span><span>{unit.type === 'cold' ? 'Cold storage' : 'Standard storage'}</span></div>
        <p className="mt-2 text-xs text-slate-500">{unit.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div><strong className="block text-base">{money(unit.monthlyPrice)}</strong><small className="text-[10px] text-slate-500">/ month · sample price</small></div>
          <Link className={`${styles.buttonSecondary} min-h-[42px] px-3.5 py-2.5 text-xs`} to={`/storage/${unit.id}${query}`}>Xem kho →</Link>
        </div>
      </div>
    </article>
  )
}

export function BrowseStoragePage() {
  const [params, setParams] = useSearchParams()
  const location = params.get('location') || ''
  const size = params.get('size') || ''
  const type = params.get('type') || ''
  const startDate = params.get('startDate') || ''
  const availableOnly = params.get('available') === '1'
  const sort = params.get('sort') || ''
  const filtered = storageUnits.filter((u) => (!location || u.location === location) && (!size || u.size === size) && (!type || u.type === type) && (!availableOnly || u.available))
  if (sort) filtered.sort((a, b) => (sort === 'price-desc' ? b.monthlyPrice - a.monthlyPrice : a.monthlyPrice - b.monthlyPrice))
  function change(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next, { replace: true })
  }
  const query = startDate ? `?startDate=${encodeURIComponent(startDate)}` : ''

  return (
    <Shell publicPage>
      <div className={styles.heading}>
        <span className={styles.kicker}>SPACE FOR YOUR NEXT CHAPTER</span>
        <h1 className="text-3xl font-bold tracking-tight max-[680px]:text-2xl">Find your storage</h1>
        <p>Choose a location, size and start date to explore preview units.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4 sm:p-5 [&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-xs [&_label]:font-semibold">
        <label>Location<select value={location} onChange={(e) => change('location', e.target.value)} className={styles.input}><option value="">All locations</option><option value="district-1">District 1</option><option value="thu-duc">Thu Duc</option></select></label>
        <label>Size<select value={size} onChange={(e) => change('size', e.target.value)} className={styles.input}><option value="">All sizes</option><option value="small">Small · 5 m²</option><option value="medium">Medium · 10 m²</option><option value="large">Large · 20 m²</option></select></label>
        <label>Unit type<select value={type} onChange={(e) => change('type', e.target.value)} className={styles.input}><option value="">All unit types</option><option value="standard">Standard</option><option value="cold">Cold storage</option></select></label>
        <label>Start date<input type="date" value={startDate} min={localToday()} onChange={(e) => change('startDate', e.target.value)} onInput={(e) => change('startDate', e.currentTarget.value)} className={styles.input} /></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 py-5 text-xs text-slate-600">
        <span role="status">{filtered.length} matching preview units</span>
        <label className={styles.checkbox}><input type="checkbox" checked={availableOnly} onChange={(e) => change('available', e.target.checked ? '1' : '')} />Available preview units only</label>
        <label className="flex items-center gap-2.5">Sort<select className={`${styles.input} w-[150px]`} value={sort} onChange={(e) => change('sort', e.target.value)}><option value="">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      </div>
      {filtered.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((u) => <UnitCard key={u.id} unit={u} query={query} />)}</div>
      ) : (
        <div className={styles.empty}><h2 className="text-lg font-semibold">No units match your filters</h2><p>Try a different location, size or unit type.</p><button type="button" className={styles.buttonSecondary} onClick={() => setParams({})}>Clear filters</button></div>
      )}
    </Shell>
  )
}

export function StorageDetailsPage() {
  const { unitId } = useParams()
  const [params] = useSearchParams()
  const unit = storageUnits.find((u) => u.id === unitId)
  if (!unit) return <Shell publicPage><div className={styles.empty}><h1 className="text-2xl font-bold">Unit not found</h1><Link className={styles.button} to="/storage">Back to units</Link></div></Shell>
  const query = params.get('startDate') ? `?startDate=${encodeURIComponent(params.get('startDate')!)}` : ''

  return (
    <Shell publicPage>
      <Link className={styles.back} to={`/storage${query}`}>← All units</Link>
      <div className="mb-8 mt-2 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <img className="h-[280px] w-full rounded-2xl object-cover sm:h-[390px] lg:h-[445px]" src={unit.image} alt={unit.name} />
        <div>
          <span className={styles.kicker}>{unit.facility}</span>
          <h1 className="my-3 text-3xl font-bold tracking-tight max-[680px]:text-2xl">{unit.name}</h1>
          <p className="text-sm text-slate-500">{unit.address}</p>
          <div className={styles.tags}><span>{unit.area} m²</span><span>{sizeLabels[unit.size]}</span><span>{unit.type === 'cold' ? 'Cold storage' : 'Standard'}</span></div>
          <p className="mt-3 text-sm text-slate-500">{unit.description}</p>
          <div className="my-5 border-y border-slate-200 py-4"><strong className="text-2xl tracking-tight">{money(unit.monthlyPrice)}</strong><span className="ml-2 text-xs text-slate-500">/ month · preview price</span></div>
          <ul className="my-5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-500">
            <li>Preview rental periods: 1, 3, 6, 12 or 24 months.</li>
            <li>Sample deposit: one month of rent.</li>
            <li>Actual prices and terms require confirmation from the facility.</li>
          </ul>
          {unit.available ? <Link className={styles.button} to={`/customer/book/${unit.id}${query}`}>Choose unit & book →</Link> : <p className="rounded-lg bg-slate-100 p-3.5 text-sm text-slate-600">This unit is unavailable in the preview catalog.</p>}
          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">You can book without an account.</p>
        </div>
      </div>
      <section className={styles.panel}><h2 className="text-lg font-semibold">Before you book</h2><p>Images and sizes are illustrative. Confirm restricted items and special storage requirements with the facility. Access instructions, handover and official contracts are not connected in this preview.</p></section>
    </Shell>
  )
}

export function BookingCheckoutPage() {
  const { unitId } = useParams()
  const user = guestUser
  const unit = storageUnits.find((u) => u.id === unitId)
  if (!unit || !unit.available) return <Shell><div className={styles.empty}><h1 className="text-2xl font-bold">Unit unavailable</h1><Link to="/storage" className={styles.button}>Choose another unit</Link></div></Shell>
  return <CheckoutForm key={`${user.userId}:${unit.id}`} user={user} unit={unit} />
}

function CheckoutForm({ user, unit }: { user: User; unit: StorageUnit }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const key = `selfstorage:guest-draft:${unit.id}`
  const [draftWarning, setDraftWarning] = useState('')
  const [input, setInput] = useState<BookingInput>(() => {
    const defaults: BookingInput = { requestId: crypto.randomUUID(), unitId: unit.id, startDate: params.get('startDate') || localToday(), months: isRentalDuration(Number(params.get('months'))) ? Number(params.get('months')) : 1, fullName: user.fullName, email: user.email, phone: user.phoneNumber || '', notes: '', accepted: false }
    try {
      const raw = sessionStorage.getItem(key)
      if (!raw) return defaults
      const saved = JSON.parse(raw) as Partial<BookingInput>
      if (saved.unitId !== unit.id || typeof saved.requestId !== 'string') return defaults
      return { ...defaults, startDate: params.get('startDate') || (typeof saved.startDate === 'string' ? saved.startDate : defaults.startDate), months: params.has('months') ? defaults.months : isRentalDuration(saved.months!) ? saved.months! : 1, requestId: saved.requestId, fullName: typeof saved.fullName === 'string' ? saved.fullName : defaults.fullName, email: typeof saved.email === 'string' ? saved.email : defaults.email, phone: typeof saved.phone === 'string' ? saved.phone : defaults.phone, notes: typeof saved.notes === 'string' ? saved.notes : '', accepted: false }
    } catch { return defaults }
  })
  const fromBooking = params.get('from') === 'booking'
  const [step, setStep] = useState(() => (fromBooking && isDate(input.startDate) && input.startDate >= localToday() && isRentalDuration(input.months) ? 1 : 0))
  const backParams = new URLSearchParams(params)
  backParams.set('startDate', input.startDate); backParams.set('months', String(input.months)); backParams.set('unit', unit.id); backParams.delete('from')
  const backToSpaces = `/booking?${backParams}`
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const guard = useRef(false)
  const errorRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [signedName, setSignedName] = useState('')

  useEffect(() => { try { sessionStorage.setItem(key, JSON.stringify(input)) } catch { setDraftWarning('Unable to save your draft. Keep this page open until you finish.') } }, [input, key])
  useEffect(() => { if (error) errorRef.current?.focus() }, [error])
  useEffect(() => { headingRef.current?.focus() }, [step])

  let endDate = ''
  try { endDate = addMonths(input.startDate, input.months) } catch { /* ignore */ }

  function update<K extends keyof BookingInput>(field: K, value: BookingInput[K]) {
    setInput((prev) => ({ ...prev, [field]: value, accepted: field === 'accepted' ? Boolean(value) : false }))
    if (field !== 'accepted') setSignedName('')
    setErrors((prev) => { const next = { ...prev }; delete next[field as string]; return next })
    setError('')
  }
  function validateField(field: string) {
    const all = validateInput(input)
    setErrors((prev) => { const next = { ...prev }; if (all[field]) next[field] = all[field]; else delete next[field]; return next })
  }
  function continueStep(event: FormEvent) {
    event.preventDefault()
    const all = validateInput(input)
    const fields = step === 0 ? ['startDate', 'months'] : step === 1 ? ['startDate', 'months', 'fullName', 'email', 'phone', 'notes'] : Object.keys(all)
    const current = Object.fromEntries(Object.entries(all).filter(([k]) => fields.includes(k)))
    if (step === 2 && !signatureMatches(signedName, input.fullName)) current.signature = 'Enter a signing name that matches the renter full name.'
    setErrors(current)
    if (Object.keys(current).length) { requestAnimationFrame(() => errorRef.current?.focus()); return }
    if (step < 2) { setStep(step + 1); return }
    if (guard.current) return
    guard.current = true; setBusy(true); setError('')
    try {
      const booking = store().create(user.userId, { ...input, contract: { version: 'storage-preview-v1', signedName: signedName.trim(), signedAt: new Date().toISOString() } }, unit)
      notify()
      try { sessionStorage.removeItem(key) } catch { /* ignore */ }
      navigate(`/customer/bookings/${encodeURIComponent(booking.id)}`, { replace: true })
    } catch (e) { setError(errorText(e)); guard.current = false; setBusy(false) }
  }

  const field = (key: 'fullName' | 'email' | 'phone', label: string, type = 'text') => (
    <label className={styles.field} htmlFor={`booking-${key}`}>
      {label}
      <input id={`booking-${key}`} aria-label={label} type={type} autoComplete={key === 'fullName' ? 'name' : key === 'phone' ? 'tel' : 'email'} value={input[key]} maxLength={key === 'fullName' ? 100 : key === 'phone' ? 20 : 254} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} onBlur={() => validateField(key)} onChange={(e) => update(key, e.target.value)} className={styles.input} />
      {errors[key] && <small id={`error-${key}`} className="text-[11px] font-normal text-red-700">{errors[key]}</small>}
    </label>
  )
  const stepLabels = fromBooking ? ['Choose Your Space', 'Customer Details', 'Confirm Booking'] : ['Rental duration', 'Contact details', 'Review & Confirm']

  return (
    <Shell>
      <Link className={styles.back} to={fromBooking ? backToSpaces : `/storage/${unit.id}`}>{fromBooking ? '← Choose your space' : '← Unit details'}</Link>
      <div className={styles.heading}>
        <span className={styles.kicker}>STORAGE BOOKING PREVIEW</span>
        <h1 className="text-3xl font-bold tracking-tight max-[680px]:text-2xl">More space. Less stress.</h1>
        <p>Review your details before submitting a preview booking.</p>
      </div>
      <ol className="mb-8 flex list-none justify-between gap-3 p-0" aria-label="Booking progress">
        {stepLabels.map((label, i) => (
          <li key={label} className={`flex flex-1 items-center gap-2 text-xs max-[680px]:flex-col max-[680px]:text-center max-[680px]:text-[9px] ${i <= step ? 'text-blue-700' : 'text-slate-500'}`} aria-current={i === step ? 'step' : undefined}>
            <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-semibold sm:h-[30px] sm:w-[30px] ${i <= step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'} ${i === step ? 'ring-4 ring-blue-100' : ''}`}>{i < step ? '✓' : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="mx-auto mb-9 w-full max-w-[900px]">
        <form className={`${styles.panel} flex flex-col gap-5`} noValidate onSubmit={continueStep}>
          <h2 ref={headingRef} tabIndex={-1} className="outline-none">{['Choose rental dates', 'Renter details', 'Review your booking'][step]}</h2>
          {draftWarning && <p role="status" className="text-[11px] text-slate-500">{draftWarning}</p>}
          {(error || Object.keys(errors).length > 0) && (
            <div ref={errorRef} className={styles.error} tabIndex={-1} role="alert">
              <strong>Please review your details</strong>
              {error && <p>{error}</p>}
              <ul>{Object.entries(errors).map(([k, m]) => <li key={k}><a href={`#booking-${k}`}>{m}</a></li>)}</ul>
            </div>
          )}
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={styles.field} htmlFor="booking-startDate">Start date<input id="booking-startDate" type="date" min={localToday()} value={input.startDate} aria-invalid={!!errors.startDate} onChange={(e) => update('startDate', e.target.value)} onBlur={() => validateField('startDate')} className={styles.input} />{errors.startDate && <small className="text-[11px] text-red-700">{errors.startDate}</small>}</label>
              <label className={styles.field} htmlFor="booking-months">Rental duration<select id="booking-months" value={input.months} aria-invalid={!!errors.months} onChange={(e) => update('months', Number(e.target.value))} onBlur={() => validateField('months')} className={styles.input}>{rentalDurations.map((m) => <option key={m} value={m}>{m} {m === 1 ? 'month' : 'months'}</option>)}</select>{errors.months && <small className="text-[11px] text-red-700">{errors.months}</small>}</label>
            </div>
          )}
          {step === 1 && (
            <>
              {field('fullName', 'Full name')}{field('email', 'Email', 'email')}{field('phone', 'Phone number', 'tel')}
              <label className={styles.field} htmlFor="booking-months-s1">Rental duration<select id="booking-months-s1" value={input.months} aria-invalid={!!errors.months} onChange={(e) => update('months', Number(e.target.value))} onBlur={() => validateField('months')} className={styles.input}>{rentalDurations.map((m) => <option key={m} value={m}>{m} {m === 1 ? 'month' : 'months'}</option>)}</select>{errors.months && <small className="text-xs text-red-700">{errors.months}</small>}</label>
              <label className={styles.field} htmlFor="booking-notes">Notes (optional)<textarea id="booking-notes" value={input.notes} maxLength={500} rows={3} onChange={(e) => update('notes', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" /><small>{input.notes.length}/500 characters. Do not enter card details or sensitive information.</small></label>
            </>
          )}
          {step === 2 && (
            <>
              <dl className={styles.review}>
                <div><dt>Unit</dt><dd>{unit.name} · {unit.facility}</dd></div>
                <div><dt>Period</dt><dd>{formatDate(input.startDate)} – {formatDate(endDate)} ({input.months} {input.months === 1 ? 'month' : 'months'})</dd></div>
                <div><dt>Renter</dt><dd>{input.fullName}</dd></div>
                <div><dt>Contact</dt><dd>{input.email}<br />{input.phone}</dd></div>
                {input.notes && <div><dt>Notes</dt><dd>{input.notes}</dd></div>}
              </dl>
              <section className="my-6 rounded-xl border border-slate-300 bg-slate-50 p-4 sm:p-6" aria-labelledby="contract-title">
                <h3 id="contract-title" className="text-base font-semibold">Preview agreement</h3>
                <p className="my-3 text-xs leading-relaxed text-slate-600">This is a browser-only preview. No real contract, payment or access rights are created. Type your full name below to confirm you understand.</p>
                <label className={styles.field} htmlFor="booking-signature">Type your full name to sign<input id="booking-signature" value={signedName} onChange={(e) => setSignedName(e.target.value)} aria-invalid={!!errors.signature} className={styles.input} />{errors.signature && <small className="text-[11px] text-red-700">{errors.signature}</small>}</label>
                {signedName.trim() && <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4"><span className="text-[11px] text-slate-500">Typed signature</span><strong className="mt-1 block break-words text-lg italic text-blue-900">{signedName.trim()}</strong></div>}
                <label className={`${styles.checkbox} mt-4`} htmlFor="booking-accepted"><input id="booking-accepted" type="checkbox" checked={input.accepted} onChange={(e) => update('accepted', e.target.checked)} aria-invalid={!!errors.accepted} aria-describedby={errors.accepted ? 'accepted-error' : undefined} />I have read the agreement, confirm my typed signature and understand that this is a preview booking.</label>
                {errors.accepted && <p id="accepted-error" className="mt-1 text-[11px] text-red-700">{errors.accepted}</p>}
              </section>
            </>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
            {step > 0 && <button disabled={busy} className={styles.buttonSecondary} type="button" onClick={() => { if (fromBooking && step === 1) { navigate(backToSpaces); return } setStep(step - 1); setErrors({}); setError('') }}>Back</button>}
            <button className={styles.button} type="submit" disabled={busy}>{busy ? 'Saving booking…' : step === 2 ? 'Confirm preview booking' : 'Continue →'}</button>
          </div>
        </form>
      </div>
    </Shell>
  )
}

export function CustomerBookingsPage() {
  const { bookings, error, loading, refresh } = useBookings()
  const [status, setStatus] = useState('')
  const filtered = bookings.filter((b) => !status || b.status === status)
  return (
    <Shell>
      <div className="mb-7 mt-6 flex flex-wrap items-center justify-between gap-4">
        <div><span className={styles.kicker}>YOUR SPACE</span><h1 className="my-2.5 text-3xl font-bold tracking-tight max-[680px]:text-2xl">My Bookings</h1><p className="text-sm text-slate-500">Track your bookings and preview payment status.</p></div>
        <Link className={styles.button} to="/storage">Book another unit →</Link>
      </div>
      <label className="mb-6 flex items-center gap-3 text-xs">Status<select className={`${styles.input} max-w-[250px]`} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All bookings</option>{Object.entries(labels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      {loading ? <Loading /> : error ? <ErrorNotice message={error} retry={refresh} /> : filtered.length ? (
        <div className="grid gap-5">{filtered.map((b) => <BookingCard key={b.id} booking={b} />)}</div>
      ) : (
        <div className={styles.empty}><h2 className="text-lg font-semibold">{bookings.length ? 'No bookings with this status' : 'No preview bookings yet'}</h2><p>Explore preview units and create your first booking.</p><Link className={styles.button} to="/storage">Find your storage</Link></div>
      )}
    </Shell>
  )
}

function BookingCard({ booking }: { booking: Booking }) {
  const unit = storageUnits.find((u) => u.id === booking.unitId)
  return (
    <article className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:gap-6 sm:p-5">
      <img src={unit?.image || '/images/storage-hero.webp'} alt={unit?.name || booking.unitId} className="h-[115px] w-[95px] shrink-0 rounded-lg object-cover sm:h-[145px] sm:w-[155px]" />
      <div className="min-w-0 flex-1">
        <span className={`${styles.status} ${statusClass(booking.status)}`}>{labels[booking.status]}</span>
        <h2 className="mt-2 text-base font-semibold sm:text-lg">{unit?.name || booking.unitId}</h2>
        <p className="text-xs text-slate-500">{unit?.facility}</p>
        <p className="text-xs text-slate-500">{formatDate(booking.startDate)} – {formatDate(booking.endDate)} · {booking.months} {booking.months === 1 ? 'month' : 'months'}</p>
        <small className="mt-1 block max-w-[330px] break-all text-[9px] text-slate-500">Booking ID: {booking.id}</small>
      </div>
      <div className="ml-auto flex flex-col items-end gap-1 whitespace-nowrap max-[680px]:w-full max-[680px]:flex-row max-[680px]:items-center max-[680px]:justify-between max-[680px]:border-t max-[680px]:border-slate-200 max-[680px]:pt-3">
        <div><strong className="block">{money(booking.total)}</strong><small className="text-[10px] text-slate-500 max-[680px]:hidden">Preview total</small></div>
        <Link className={`${styles.buttonSecondary} min-h-[42px] px-3.5 py-2.5 text-xs`} to={`/customer/bookings/${encodeURIComponent(booking.id)}`}>View booking →</Link>
      </div>
    </article>
  )
}

export function BookingConfirmationPage() {
  const { bookingId } = useParams()
  const { bookings, user, error: loadError, loading, refresh } = useBookings()
  const booking = bookings.find((b) => b.id === bookingId)
  const unit = storageUnits.find((u) => u.id === booking?.unitId)
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
    try {
      if (kind === 'pay') store().pay(user.userId, booking.id); else store().cancel(user.userId, booking.id)
      notify(); refresh(); setCancelOpen(false); setPaymentOpen(false)
    } catch (e) { setError(errorText(e)) }
    finally { guard.current = false; setBusy(false) }
  }

  if (loading) return <Shell><Loading /></Shell>
  if (loadError) return <Shell><ErrorNotice message={loadError} retry={refresh} /></Shell>
  if (!booking || !unit) return <Shell><div className={styles.empty}><h1 className="text-2xl font-bold">Booking not found on this browser</h1><Link className={styles.button} to="/customer/units">Back to bookings</Link></div></Shell>

  const kicker = booking.status === 'cancelled' ? 'PREVIEW BOOKING CANCELLED' : booking.status === 'confirmed' ? 'PREVIEW COMPLETE' : 'PREVIEW BOOKING SAVED'
  const title = booking.status === 'confirmed' ? 'Preview booking confirmed!' : booking.status === 'cancelled' ? 'Your booking has been cancelled.' : 'Your booking has been saved.'

  return (
    <Shell>
      <Link className={styles.back} to="/customer/units">← My Bookings</Link>
      <div className={styles.heading}>
        <span className={styles.kicker}>{kicker}</span>
        <h1 className="text-3xl font-bold tracking-tight max-[680px]:text-2xl">{title}</h1>
        <p>{booking.status === 'pending' ? 'Next step: simulate payment to confirm your preview booking.' : 'This status only applies to the browser preview.'}</p>
      </div>
      {error && <ErrorNotice message={error} />}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.65fr_1fr] lg:gap-7">
        <div className={styles.panel}>
          <span className={`${styles.status} ${statusClass(booking.status)}`}>{labels[booking.status]}</span>
          <h2 className="mt-3 text-xl font-semibold">{unit.name} · {unit.facility}</h2>
          {booking.contract && (
            <section className="my-6 rounded-xl border border-slate-300 bg-slate-50 p-4 sm:p-6">
              <span className={styles.kicker}>SIGNED AGREEMENT · PREVIEW</span>
              <h3 className="mt-2 text-base font-semibold">Signature saved</h3>
              <p className="my-3 text-sm leading-relaxed text-slate-600">Signed by: <strong>{booking.contract.signedName}</strong><br />Signed at: {new Date(booking.contract.signedAt).toLocaleString('en-GB')}<br />Version: 1.0</p>
              <p className="text-[11px] text-slate-500">Your typed signature is saved with this booking on this browser.</p>
            </section>
          )}
          <dl className={styles.review}>
            <div><dt>Booking ID</dt><dd className="break-all text-[10px]">{booking.id}</dd></div>
            <div><dt>Start date</dt><dd>{formatDate(booking.startDate)}</dd></div>
            <div><dt>End date (exclusive)</dt><dd>{formatDate(booking.endDate)}</dd></div>
            <div><dt>Duration</dt><dd>{booking.months} {booking.months === 1 ? 'month' : 'months'}</dd></div>
            <div><dt>Renter</dt><dd>{booking.fullName}</dd></div>
            <div><dt>Contact</dt><dd>{booking.email}<br />{booking.phone}</dd></div>
            {booking.notes && <div><dt>Notes</dt><dd>{booking.notes}</dd></div>}
          </dl>
          {booking.status === 'confirmed' && <div className={`${styles.calloutSuccess} my-5`}><strong>Payment simulation complete.</strong><p className="mt-1.5">No real transaction was made. The facility will provide handover and access instructions when connected. This preview does not issue PINs or access rights.</p></div>}
          {booking.status !== 'cancelled' && (
            <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
              {booking.status === 'pending' && <button type="button" className={styles.button} onClick={() => setPaymentOpen(true)}>Simulate payment</button>}
              <button type="button" className={styles.textBtnDanger} disabled={busy} onClick={() => setCancelOpen(true)}>Cancel preview booking</button>
            </div>
          )}
          <Link className={styles.textBtn} to="/storage">Continue exploring →</Link>
        </div>
        <aside className={`${styles.panel} sticky top-[100px] max-[680px]:static`}>
          <img src={unit.image} alt={unit.name} className="mb-5 h-[175px] w-full rounded-lg object-cover" />
          <h2 className="text-lg font-semibold">Preview costs</h2>
          <dl className="mt-5">
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5 text-xs"><dt className="text-slate-500">Rent</dt><dd className="m-0 font-semibold whitespace-nowrap">{money(booking.rentalTotal)}</dd></div>
            <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5 text-xs"><dt className="text-slate-500">Sample deposit</dt><dd className="m-0 font-semibold whitespace-nowrap">{money(booking.deposit)}</dd></div>
            <div className="mt-2 flex justify-between gap-4 border-t border-slate-200 pt-4 text-base font-semibold"><dt>Total</dt><dd className="m-0 whitespace-nowrap">{money(booking.total)}</dd></div>
          </dl>
          {booking.paymentId && <p className="mt-3 text-[11px] text-slate-500">Preview payment ID: <span className="break-all text-[10px]">{booking.paymentId}</span></p>}
          {paymentOpen && booking.status === 'pending' && (
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">
              <h3 className="text-sm font-semibold">Confirm payment simulation</h3>
              <p className="my-2.5 text-xs text-slate-600">This only updates preview booking status. No card details or money transfers are required.</p>
              <button type="button" className={`${styles.button} w-full`} disabled={busy} onClick={() => action('pay')}>{busy ? 'Processing…' : 'Simulate successful payment'}</button>
              <button type="button" className={styles.textBtn} onClick={() => setPaymentOpen(false)}>Later</button>
            </div>
          )}
          <Link className={styles.textBtn} to="/customer/payments">Payment history →</Link>
        </aside>
      </div>
      {cancelOpen && (
        <dialog ref={cancelDialog} className="fixed inset-0 m-auto h-fit max-h-[calc(100dvh-40px)] w-[calc(100%-40px)] max-w-[500px] overflow-auto rounded-2xl border-0 p-7 text-slate-900 backdrop:bg-slate-900/60" aria-labelledby="cancel-title" onCancel={() => setCancelOpen(false)}>
          <h2 id="cancel-title" className="text-xl font-semibold">Cancel this preview booking?</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">The cancelled booking stays in your history. No real money is collected or refunded. The unit can be booked again in this preview.</p>
          <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
            <button type="button" autoFocus className={styles.buttonSecondary} onClick={() => setCancelOpen(false)}>Keep booking</button>
            <button type="button" disabled={busy} className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-55" onClick={() => action('cancel')}>{busy ? 'Cancelling…' : 'Confirm cancellation'}</button>
          </div>
          {error && <ErrorNotice message={error} />}
        </dialog>
      )}
    </Shell>
  )
}

export function CustomerPaymentsPage() {
  const { bookings, loading, error, refresh } = useBookings()
  const paid = bookings.filter((b) => b.paymentId)
  return (
    <Shell>
      <div className={styles.heading}>
        <span className={styles.kicker}>PREVIEW HISTORY</span>
        <h1 className="text-3xl font-bold tracking-tight max-[680px]:text-2xl">My Payments</h1>
        <p>No bank transactions or real payments are made in this preview.</p>
      </div>
      {loading ? <Loading /> : error ? <ErrorNotice message={error} retry={refresh} /> : paid.length ? (
        <div className={`${styles.panel} overflow-auto`}>
          <table className="w-full min-w-[600px] border-collapse text-xs">
            <caption className="mb-5 text-left text-lg font-semibold">Payment simulations</caption>
            <thead><tr>{['Payment ID', 'Date', 'Sample amount', 'Booking status', 'Details'].map((h) => <th key={h} className="border-b border-slate-200 px-3 py-3.5 text-left text-[10px] font-medium whitespace-nowrap text-slate-500">{h}</th>)}</tr></thead>
            <tbody>{paid.map((b) => (
              <tr key={b.id}>
                <td className="border-b border-slate-200 px-3 py-3.5 break-all text-[10px]">{b.paymentId}</td>
                <td className="border-b border-slate-200 px-3 py-3.5">{new Date(b.paidAt!).toLocaleDateString('en-GB')}</td>
                <td className="border-b border-slate-200 px-3 py-3.5">{money(b.total)}</td>
                <td className="border-b border-slate-200 px-3 py-3.5">{labels[b.status]}</td>
                <td className="border-b border-slate-200 px-3 py-3.5"><Link className="font-semibold text-blue-600" to={`/customer/bookings/${encodeURIComponent(b.id)}`}>View booking</Link></td>
              </tr>
            ))}</tbody>
          </table>
          <p className="mt-3 text-[11px] text-slate-500">Cancelled bookings retain their simulated transactions. No actual refunds are processed.</p>
        </div>
      ) : (
        <div className={styles.empty}><h2 className="text-lg font-semibold">No payment simulations yet</h2><p>Open a pending booking to continue.</p><Link className={styles.button} to="/customer/units">View my bookings</Link></div>
      )}
    </Shell>
  )
}

export function CustomerBookingDashboard() {
  const { bookings, user, loading, error, refresh } = useBookings()
  const active = bookings.filter((b) => b.status !== 'cancelled')
  return (
    <Shell>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-9">
        <span className={styles.kicker}>SELFSTORAGE · YOUR SPACE</span>
        <h1 className="my-3 text-3xl font-bold tracking-tight max-[680px]:text-2xl">Hello, {user?.fullName || 'there'}.</h1>
        <p className="mb-5 text-sm text-slate-500">Find your space and follow your booking journey in one place.</p>
        <Link className={styles.button} to="/storage">Find & book storage →</Link>
      </div>
      <div className="mb-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><span className="text-[10px] text-slate-500">Active bookings</span><strong className="mt-2 block text-2xl font-semibold">{active.length}</strong></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><span className="text-[10px] text-slate-500">Awaiting preview payment</span><strong className="mt-2 block text-2xl font-semibold">{active.filter((b) => b.status === 'pending').length}</strong></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><span className="text-[10px] text-slate-500">Confirmed preview</span><strong className="mt-2 block text-2xl font-semibold">{active.filter((b) => b.status === 'confirmed').length}</strong></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5"><span className="text-[10px] text-slate-500">Total simulated payments</span><strong className="mt-2 block break-all text-xl font-semibold sm:text-2xl">{money(bookings.filter((b) => b.paymentId).reduce((s, b) => s + b.total, 0))}</strong></div>
      </div>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Recent bookings</h2>
        <Link className={styles.textBtn} to="/customer/units">View all →</Link>
      </div>
      {loading ? <Loading /> : error ? <ErrorNotice message={error} retry={refresh} /> : bookings.length ? (
        <div className="grid gap-5">{bookings.slice(0, 3).map((b) => <BookingCard key={b.id} booking={b} />)}</div>
      ) : (
        <div className={styles.empty}><h2 className="text-lg font-semibold">A little space for your next chapter.</h2><p>No preview bookings yet. Start by choosing a unit.</p><Link className={styles.button} to="/storage">Explore preview units</Link></div>
      )}
    </Shell>
  )
}