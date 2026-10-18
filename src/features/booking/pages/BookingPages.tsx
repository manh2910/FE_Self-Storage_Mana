import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { User } from '../../auth/types/auth'
import { DemoBookingStore, addMonths, isRentalDuration, rentalDurations, localToday, signatureMatches, validateInput, type Booking, type BookingInput } from '../model/domain'
import { money, sizeLabels } from '../model/catalog'
import { createBookingInDB, fetchCustomerBookingsFromDB, cancelBookingInDB, type RealBookingResponse } from '../api/bookingApi'
import axiosClient from '../../../shared/api/axiosClient'

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

const labels = { pending: 'Awaiting payment', confirmed: 'Confirmed', cancelled: 'Cancelled' } as const

// Hàm format ngày định dạng dd/mm/yyyy an toàn với mọi loại dữ liệu (ISO string, yyyy-mm-dd)
const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const cleanDate = dateString.split('T')[0]
  return cleanDate.split('-').reverse().join('/')
}

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
  return null
}

function Shell({ children, publicPage = false }: { children: ReactNode; publicPage?: boolean }) {
  const location = useLocation()
  const isPublic = publicPage && !location.pathname.startsWith('/customer')
  return (
    <div className={`font-sans text-sm leading-relaxed text-slate-900 [&_a]:no-underline [&_button]:cursor-pointer [&_img]:block [&_img]:object-cover ${isPublic ? 'min-h-screen bg-slate-50' : ''}`}>
      <div className={`mx-auto w-full ${isPublic ? 'max-w-[1200px] px-5 py-6 sm:px-6 sm:pb-16 sm:pt-8' : ''}`}>
        {children}
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
  return <p role="status" className="p-10 text-center text-slate-500">Đang tải dữ liệu…</p>
}

function UnitCard({ unit, query }: { unit: any; query: string }) {
  const targetId = unit.id || unit.unitId || unit.code

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/customer/book/${targetId}${query}`} className="relative block h-[210px] overflow-hidden max-[680px]:h-[220px]">
        <img src={unit.image} alt={unit.name} loading="lazy" className="h-full w-full transition duration-300 hover:scale-[1.035] motion-reduce:hover:scale-100" />
        <span className={`absolute left-3.5 top-3.5 rounded bg-white px-2.5 py-1 text-[10px] font-semibold ${unit.available ? 'text-emerald-700' : 'text-slate-600'}`}>
          {unit.available ? 'Available' : 'Occupied'}
        </span>
      </Link>
      <div className="p-5">
        <span className={styles.kicker}>{unit.facility}</span>
        <h2 className="my-1.5 text-lg font-semibold">{unit.name}</h2>
        <p className="text-xs text-slate-500">{unit.address}</p>
        <div className={styles.tags}>
          <span>{unit.area} m²</span>
          <span>{unit.type === 'cold' ? 'Cold storage' : 'Standard storage'}</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">{unit.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
          <div>
            <strong className="block text-base">{money(unit.monthlyPrice)}</strong>
            <small className="text-[10px] text-slate-500">/ month</small>
          </div>
          <Link
            className="inline-flex min-h-[42px] items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            to={`/customer/book/${targetId}${query}`}
          >
            Choose unit →
          </Link>
        </div>
      </div>
    </article>
  )
}

export function BrowseStoragePage() {
  const [params, setParams] = useSearchParams()
  const [dbUnits, setDbUnits] = useState<any[]>([])
  const [loadingDb, setLoadingDb] = useState(true)

  const location = params.get('location') || ''
  const size = params.get('size') || ''
  const type = params.get('type') || ''
  const startDate = params.get('startDate') || ''
  const availableOnly = params.get('available') === '1'
  const sort = params.get('sort') || ''

  useEffect(() => {
    async function loadUnitsFromSQL() {
      setLoadingDb(true)
      try {
        const response = await axiosClient.get('/units')
        if (response.data && Array.isArray(response.data)) {
          setDbUnits(response.data)
        }
      } catch (err) {
        console.error("Lỗi khi fetch API /units:", err)
      } finally {
        setLoadingDb(false)
      }
    }
    loadUnitsFromSQL()
  }, [])

  const displayUnits = dbUnits.map((u) => {
    let sizeCategory = 'medium'
    if (u.area <= 5 || (u.code && String(u.code).startsWith('S'))) sizeCategory = 'small'
    else if (u.area >= 20 || (u.code && String(u.code).startsWith('L'))) sizeCategory = 'large'

    const facilityName = u.facilityName || u.location || ''
    const isThuDuc = facilityName.toLowerCase().includes('thu duc') || facilityName.toLowerCase().includes('thủ đức')
    const dynamicAddress = isThuDuc ? 'Thủ Đức, TP.HCM' : 'Quận 1, TP.HCM'

    const targetId = String(u.id ?? u.unitId ?? u.code)

    return {
      id: targetId,
      unitId: u.unitId || u.id,
      code: u.code,
      name: `Kho ${u.code} (${sizeCategory === 'small' ? 'Small Unit' : sizeCategory === 'medium' ? 'Medium Unit' : 'Large Unit'})`,
      facility: facilityName || 'SelfStorage District 1',
      address: dynamicAddress,
      area: u.area || 10,
      size: sizeCategory,
      type: 'standard',
      monthlyPrice: u.price || 1400000,
      available: u.status === 'Available',
      image: '/images/storage-hero.webp',
      description: `Không gian lưu trữ tiện lợi, an toàn và bảo mật tại ${facilityName || 'chi nhánh'}.`
    }
  })

  const filtered = displayUnits.filter((u) => 
    (!location || u.facility.toLowerCase().includes(location.toLowerCase())) && 
    (!size || u.size === size) && 
    (!type || u.type === type) && 
    (!availableOnly || u.available)
  )

  if (sort) {
    filtered.sort((a, b) => (sort === 'price-desc' ? b.monthlyPrice - a.monthlyPrice : a.monthlyPrice - b.monthlyPrice))
  }

  function change(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    setParams(next, { replace: true })
  }
  const query = startDate ? `?startDate=${encodeURIComponent(startDate)}` : ''

  return (
    <Shell publicPage>
      <div className={styles.heading}>
        <span className={styles.kicker}>CHỌN KHO LƯU TRỮ</span>
        <h1 className="text-3xl font-bold tracking-tight">Choose your storage unit</h1>
        <p>Danh sách các ô kho hiện có sẵn sàng phục vụ nhu cầu của bạn.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4 sm:p-5 [&_label]:flex [&_label]:flex-col [&_label]:gap-2 [&_label]:text-xs [&_label]:font-semibold">
        <label>Location<select value={location} onChange={(e) => change('location', e.target.value)} className={styles.input}><option value="">All locations</option><option value="district-1">District 1</option><option value="thu-duc">Thu Duc</option></select></label>
        <label>Size<select value={size} onChange={(e) => change('size', e.target.value)} className={styles.input}><option value="">All sizes</option><option value="small">Small · 5 m²</option><option value="medium">Medium · 10 m²</option><option value="large">Large · 20 m²</option></select></label>
        <label>Unit type<select value={type} onChange={(e) => change('type', e.target.value)} className={styles.input}><option value="">All unit types</option><option value="standard">Standard</option><option value="cold">Cold storage</option></select></label>
        <label>Start date<input type="date" value={startDate} min={localToday()} onChange={(e) => change('startDate', e.target.value)} onInput={(e) => change('startDate', e.currentTarget.value)} className={styles.input} /></label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-5 text-xs text-slate-600">
        <span role="status">{loadingDb ? 'Đang tải dữ liệu...' : `${filtered.length} matching units`}</span>
        <label className={styles.checkbox}><input type="checkbox" checked={availableOnly} onChange={(e) => change('available', e.target.checked ? '1' : '')} />Available units only</label>
        <label className="flex items-center gap-2.5">Sort<select className={`${styles.input} w-[150px]`} value={sort} onChange={(e) => change('sort', e.target.value)}><option value="">Recommended</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
      </div>

      {loadingDb ? (
        <Loading />
      ) : filtered.length ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u: any) => <UnitCard key={u.id} unit={u} query={query} />)}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2 className="text-lg font-semibold">Không tìm thấy ô kho nào</h2>
          <p>Hãy thử thay đổi bộ lọc tìm kiếm.</p>
          <button type="button" className={styles.buttonSecondary} onClick={() => setParams({})}>Clear filters</button>
        </div>
      )}
    </Shell>
  )
}

export function StorageDetailsPage() {
  const { unitId } = useParams()
  const [params] = useSearchParams()
  const [unit, setUnit] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUnitDetail() {
      setLoading(true)
      try {
        const response = await axiosClient.get('/units')
        if (response.data && Array.isArray(response.data)) {
          const searchParam = String(unitId || '').toLowerCase().trim()
          
          const found = response.data.find((u: any) => {
            const uId = String(u.id ?? '').toLowerCase().trim()
            const uUnitId = String(u.unitId ?? '').toLowerCase().trim()
            const uCode = String(u.code ?? '').toLowerCase().trim()

            return uId === searchParam || uUnitId === searchParam || uCode === searchParam
          })

          if (found) {
            let sizeCategory = 'medium'
            if (found.area <= 5 || (found.code && String(found.code).startsWith('S'))) sizeCategory = 'small'
            else if (found.area >= 20 || (found.code && String(found.code).startsWith('L'))) sizeCategory = 'large'

            const facilityName = found.facilityName || found.location || ''
            const isThuDuc = facilityName.toLowerCase().includes('thu duc') || facilityName.toLowerCase().includes('thủ đức')
            const dynamicAddress = isThuDuc ? 'Thủ Đức, TP.HCM' : 'Quận 1, TP.HCM'

            setUnit({
              id: String(found.id ?? found.unitId ?? found.code),
              name: `Kho ${found.code} (${found.type || 'Storage Unit'})`,
              facility: facilityName || 'SelfStorage District 1',
              address: dynamicAddress,
              area: found.area || 10,
              size: sizeCategory,
              type: 'standard',
              monthlyPrice: found.price || 1400000,
              available: found.status === 'Available',
              image: '/images/storage-hero.webp',
              description: `Không gian lưu trữ tiện lợi, an toàn và bảo mật tại ${facilityName || 'chi nhánh'}.`
            })
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết kho:', err)
      } finally {
        setLoading(false)
      }
    }

    if (unitId) {
      loadUnitDetail()
    }
  }, [unitId])

  if (loading) {
    return (
      <Shell publicPage>
        <p className="p-10 text-center text-slate-500">Đang tải dữ liệu…</p>
      </Shell>
    )
  }

  if (!unit) {
    return (
      <Shell publicPage>
        <div className={styles.empty}>
          <h1 className="text-2xl font-bold">Unit not found</h1>
          <p className="mt-2 text-sm text-slate-500">Ô kho này không tồn tại trong hệ thống.</p>
          <Link className={`${styles.button} mt-4`} to="/customer">
            Back to units
          </Link>
        </div>
      </Shell>
    )
  }

  const query = params.get('startDate') ? `?startDate=${encodeURIComponent(params.get('startDate')!)}` : ''

  return (
    <Shell publicPage>
      <Link className={styles.back} to={`/customer${query}`}>
        ← All units
      </Link>
      <div className="mb-8 mt-2 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <img className="h-[280px] w-full rounded-2xl object-cover sm:h-[390px] lg:h-[445px]" src={unit.image} alt={unit.name} />
        <div>
          <span className={styles.kicker}>{unit.facility}</span>
          <h1 className="my-3 text-3xl font-bold tracking-tight max-[680px]:text-2xl">{unit.name}</h1>
          <p className="text-sm text-slate-500">{unit.address}</p>
          <div className={styles.tags}>
            <span>{unit.area} m²</span>
            <span>{sizeLabels[unit.size as keyof typeof sizeLabels] || 'Medium'}</span>
            <span>{unit.type === 'cold' ? 'Cold storage' : 'Standard'}</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">{unit.description}</p>
          <div className="my-5 border-y border-slate-200 py-4">
            <strong className="text-2xl tracking-tight">{money(unit.monthlyPrice)}</strong>
            <span className="ml-2 text-xs text-slate-500">/ month</span>
          </div>
          <ul className="my-5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-500">
            <li>Thời hạn thuê linh hoạt: 1, 3, 6, 12 hoặc 24 tháng.</li>
            <li>Tiền đặt cọc: 1 tháng tiền thuê.</li>
            <li>Miễn phí ra vào kho trong giờ làm việc.</li>
          </ul>
          {unit.available ? (
            <Link className={styles.button} to={`/customer/book/${unit.id}${query}`}>
              Choose unit & book →
            </Link>
          ) : (
            <p className="rounded-lg bg-slate-100 p-3.5 text-sm text-slate-600">Ô kho này hiện không sẵn có để đặt trước.</p>
          )}
        </div>
      </div>
    </Shell>
  )
}

export function BookingCheckoutPage() {
  const { unitId } = useParams()
  const user = guestUser
  const [unit, setUnit] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUnit() {
      setLoading(true)
      try {
        const response = await axiosClient.get('/units')
        if (response.data && Array.isArray(response.data)) {
          const searchParam = String(unitId || '').toLowerCase().trim()

          const found = response.data.find((u: any) => {
            const uId = String(u.id ?? '').toLowerCase().trim()
            const uUnitId = String(u.unitId ?? '').toLowerCase().trim()
            const uCode = String(u.code ?? '').toLowerCase().trim()

            return uId === searchParam || uUnitId === searchParam || uCode === searchParam
          })

          if (found) {
            const facilityName = found.facilityName || found.location || ''
            const isThuDuc = facilityName.toLowerCase().includes('thu duc') || facilityName.toLowerCase().includes('thủ đức')
            setUnit({
              id: String(found.id ?? found.unitId ?? found.code),
              name: `Kho ${found.code}`,
              facility: facilityName || 'SelfStorage District 1',
              address: isThuDuc ? 'Thủ Đức, TP.HCM' : 'Quận 1, TP.HCM',
              area: found.area || 10,
              monthlyPrice: found.price || 1400000,
              available: found.status === 'Available',
              image: '/images/storage-hero.webp',
            })
          }
        }
      } catch (err) {
        console.error('Lỗi khi tải thông tin ô kho:', err)
      } finally {
        setLoading(false)
      }
    }

    if (unitId) loadUnit()
  }, [unitId])

  if (loading) return <Shell><Loading /></Shell>

  if (!unit || !unit.available) {
    return (
      <Shell>
        <div className={styles.empty}>
          <h1 className="text-2xl font-bold">Unit unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">Ô kho này hiện tại không khả dụng để đặt trước.</p>
          <Link to="/customer" className={`${styles.button} mt-4`}>
            Choose another unit
          </Link>
        </div>
      </Shell>
    )
  }

  return <CheckoutForm key={`${user.userId}:${unit.id}`} user={user} unit={unit} />
}

function CheckoutForm({ user, unit }: { user: User; unit: any }) {
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

  const [step, setStep] = useState(0)
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

  async function continueStep(event: FormEvent) {
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
      const unitTypeId = unit.area <= 5 ? 1 : unit.area >= 20 ? 3 : 2;
      
      const created = await createBookingInDB({
        customerId: 1, 
        facilityId: 1, 
        unitTypeId: unitTypeId,
        startDate: input.startDate,
        rentalMonths: input.months,
        selectedPackageIds: [1] 
      });

      if (!created) {
        throw new Error('Không thể tạo đơn đặt kho. Vui lòng thử lại.')
      }

      notify()
      try { sessionStorage.removeItem(key) } catch { /* ignore */ }
      const targetId = created.reservationId || (created as any).id || 1
      navigate(`/customer/bookings/${encodeURIComponent(targetId)}`, { replace: true })
    } catch (e) { 
      setError(errorText(e)); 
      guard.current = false; 
      setBusy(false) 
    }
  }

  const field = (key: 'fullName' | 'email' | 'phone', label: string, type = 'text') => (
    <label className={styles.field} htmlFor={`booking-${key}`}>
      {label}
      <input id={`booking-${key}`} aria-label={label} type={type} autoComplete={key === 'fullName' ? 'name' : key === 'phone' ? 'tel' : 'email'} value={input[key]} maxLength={key === 'fullName' ? 100 : key === 'phone' ? 20 : 254} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} onBlur={() => validateField(key)} onChange={(e) => update(key, e.target.value)} className={styles.input} />
      {errors[key] && <small id={`error-${key}`} className="text-[11px] font-normal text-red-700">{errors[key]}</small>}
    </label>
  )
  const stepLabels = ['Rental duration', 'Contact details', 'Review & Confirm']

  return (
    <Shell>
      <Link className={styles.back} to="/customer">← Choose your space</Link>
      <div className={styles.heading}>
        <span className={styles.kicker}>STORAGE BOOKING</span>
        <h1 className="text-3xl font-bold tracking-tight max-[680px]:text-2xl">More space. Less stress.</h1>
        <p>Review your details before submitting your booking request.</p>
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
              <label className={styles.field} htmlFor="booking-notes">Notes (optional)<textarea id="booking-notes" value={input.notes} maxLength={500} rows={3} onChange={(e) => update('notes', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" /><small>{input.notes.length}/500 characters. Do not enter sensitive information.</small></label>
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
                <h3 id="contract-title" className="text-base font-semibold">Terms & Rental Agreement</h3>
                <p className="my-3 text-xs leading-relaxed text-slate-600">Type your full name below to confirm you agree to the terms.</p>
                <label className={styles.field} htmlFor="booking-signature">Type your full name to sign<input id="booking-signature" value={signedName} onChange={(e) => setSignedName(e.target.value)} aria-invalid={!!errors.signature} className={styles.input} />{errors.signature && <small className="text-[11px] text-red-700">{errors.signature}</small>}</label>
                {signedName.trim() && <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4"><span className="text-[11px] text-slate-500">Typed signature</span><strong className="mt-1 block break-words text-lg italic text-blue-900">{signedName.trim()}</strong></div>}
                <label className={`${styles.checkbox} mt-4`} htmlFor="booking-accepted"><input id="booking-accepted" type="checkbox" checked={input.accepted} onChange={(e) => update('accepted', e.target.checked)} aria-invalid={!!errors.accepted} aria-describedby={errors.accepted ? 'accepted-error' : undefined} />I have read and agree to the terms and rental agreement.</label>
                {errors.accepted && <p id="accepted-error" className="mt-1 text-[11px] text-red-700">{errors.accepted}</p>}
              </section>
            </>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
            {step > 0 && <button disabled={busy} className={styles.buttonSecondary} type="button" onClick={() => { setStep(step - 1); setErrors({}); setError('') }}>Back</button>}
            <button className={styles.button} type="submit" disabled={busy}>{busy ? 'Processing booking…' : step === 2 ? 'Confirm Booking' : 'Continue →'}</button>
          </div>
        </form>
      </div>
    </Shell>
  )
}

export function CustomerBookingsPage() {
  const [realBookings, setRealBookings] = useState<RealBookingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const loadBookings = useCallback(async () => {
    setLoading(true)
    const data = await fetchCustomerBookingsFromDB(1)
    setRealBookings(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const filtered = realBookings.filter((b) => !status || b.status.toLowerCase() === status.toLowerCase())

  return (
    <Shell>
      <div className="mb-7 mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className={styles.kicker}>YOUR SPACE</span>
          <h1 className="my-2.5 text-3xl font-bold tracking-tight max-[680px]:text-2xl">My Bookings</h1>
          <p className="text-sm text-slate-500">Track and manage your storage bookings.</p>
        </div>
        <Link className={styles.button} to="/customer">Book another unit →</Link>
      </div>

      <label className="mb-6 flex items-center gap-3 text-xs">
        Status
        <select className={`${styles.input} max-w-[250px]`} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="checkedin">Checked In</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>

      {loading ? (
        <Loading />
      ) : filtered.length ? (
        <div className="grid gap-5">
          {filtered.map((b) => (
            <RealBookingCard key={b.reservationId} booking={b} onCancelled={loadBookings} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2 className="text-lg font-semibold">No bookings found</h2>
          <p>Explore available units and create your first booking.</p>
          <Link className={styles.button} to="/customer">Find your storage</Link>
        </div>
      )}
    </Shell>
  )
}

function RealBookingCard({ booking, onCancelled }: { booking: RealBookingResponse; onCancelled: () => void }) {
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn đặt kho này không?`)) return
    setCancelling(true)
    const ok = await cancelBookingInDB(booking.reservationId, 1)
    setCancelling(false)
    if (ok) {
      alert('Đã hủy đơn thành công!')
      onCancelled()
    } else {
      alert('Hủy đơn thất bại. Vui lòng thử lại.')
    }
  }

  return (
    <article className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:gap-6 sm:p-5 shadow-xs">
      <img src="/images/storage-hero.webp" alt={booking.unitTypeName} className="h-[115px] w-[95px] shrink-0 rounded-lg object-cover sm:h-[145px] sm:w-[155px]" />
      <div className="min-w-0 flex-1">
        <span className={`inline-block rounded px-2.5 py-1 text-[10px] font-medium ${booking.status === 'Cancelled' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-800'}`}>
          {booking.status}
        </span>
        <h2 className="mt-2 text-base font-semibold sm:text-lg">{booking.unitTypeName} · {booking.facilityName}</h2>
        <p className="text-xs text-slate-500">Mã kho: <strong className="text-slate-800">{booking.unitCode}</strong></p>
        <p className="text-xs text-slate-500">Thời gian: {formatDate(booking.startDate)} – {formatDate(booking.endDate)} ({booking.rentalMonths} tháng)</p>
        {/* Đã xóa dòng Reservation ID ở đây để giao diện sạch sẽ, thân thiện hơn */}
      </div>

      <div className="ml-auto flex flex-col items-end gap-2 whitespace-nowrap">
        <strong className="block text-lg text-blue-600">{money(booking.totalAmount)}</strong>
        {booking.status !== 'Cancelled' && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition"
          >
            {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
          </button>
        )}
      </div>
    </article>
  )
}

export function BookingConfirmationPage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const response = await axiosClient.get(`/bookings/${bookingId}`)
        setBooking(response.data)
      } catch (err) {
        console.error('Lỗi khi tải thông tin đơn đặt kho:', err)
      } finally {
        setLoading(false)
      }
    }
    if (bookingId) load()
  }, [bookingId])

  if (loading) return <Shell><Loading /></Shell>

  if (!booking) {
    return (
      <Shell>
        <div className={styles.empty}>
          <h1 className="text-2xl font-bold">Booking not found</h1>
          <Link to="/customer/units" className={`${styles.button} mt-4`}>Xem danh sách đơn đặt kho của tôi</Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className={styles.panel}>
        <div className={styles.calloutSuccess}>
          <h1 className="text-xl font-bold mb-1">Đặt kho thành công!</h1>
          <p>Mã đơn hàng: <strong>{booking.id || bookingId}</strong></p>
        </div>

        <div className={styles.review}>
          <div><dt>Họ và tên</dt><dd>{booking.fullName || booking.customerName}</dd></div>
          <div><dt>Mã kho</dt><dd>{booking.unitCode || booking.unitId || 'Đang chờ phân bổ'}</dd></div>
          <div><dt>Ngày bắt đầu</dt><dd>{formatDate(booking.startDate)}</dd></div>
          <div><dt>Thời gian thuê</dt><dd>{booking.months || booking.rentalMonths} tháng</dd></div>
          <div><dt>Trạng thái</dt><dd><span className={statusClass('confirmed')}>Đã xác nhận</span></dd></div>
        </div>

        <Link to="/customer/units" className={styles.button}>
          Quản lý đơn thuê của tôi →
        </Link>
      </div>
    </Shell>
  )
}

export function CustomerPaymentsPage() {
  return (
    <Shell>
      <div className={styles.panel}>
        <h1 className="text-xl font-bold mb-2">Lịch sử thanh toán</h1>
        <p className="text-xs text-slate-500">Xem và quản lý toàn bộ các hóa đơn thanh toán tiền thuê kho.</p>
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
          Chưa có giao dịch thanh toán phát sinh.
        </div>
      </div>
    </Shell>
  )
}