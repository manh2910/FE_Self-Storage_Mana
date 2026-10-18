import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { money } from '../../booking/model/catalog'
import { localToday, rentalDurations } from '../../booking/model/domain'
import { useBookings } from '../../booking/pages/BookingPages'
import { filterError, filterParams, type SpaceFilters } from '../../booking/model/spaceFilters'
import { fetchCustomerUnitsFromDB, type RealCustomerUnit } from '../api/customerUnitsApi'

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = { 
    box: 'm12 3 9 5v9l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5M12 13v9', 
    pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0', 
    calendar: 'M7 3v4M17 3v4M3 10h18M5 5h14v16H5Z', 
    ruler: 'm3 16 13-13 5 5-13 13-5-5Zm5-5 3 3m1-7 3 3', 
    check: 'm5 12 4 4L19 6', 
    arrow: 'M4 12h16m-6-6 6 6-6 6', 
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6', 
    search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0m-2 5 6 6', 
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l3 2', 
    help: 'M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3M12 17h.01' 
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.box} /></svg>
}

const styles = {
  cbEyebrow: [
    "[.customer-booking_&]:inline-flex [.customer-booking_&]:items-center [.customer-booking_&]:text-[color:#1d4ed8]",
    "[.customer-booking_&]:text-[length:10px] [.customer-booking_&]:font-[750] [.customer-booking_&]:tracking-[1.7px]",
    "[.customer-booking_&]:gap-2 [&>span]:h-1.5 [&>span]:w-1.5 [&>span]:bg-[color:#06b6d4]",
  ].join(' '),
  cbButton: [
    "inline-flex min-h-[42px] items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700",
  ].join(' '),
} as const

const freshFilters = (): SpaceFilters => ({ location: '', size: '', startDate: localToday(), months: 1, type: '', maxPrice: '' })

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  
  const readFilters = (): SpaceFilters => ({
    location: params.get('location') || '',
    size: params.get('size') || '',
    startDate: params.get('startDate') || localToday(),
    months: params.has('months') ? Number(params.get('months')) : 1,
    type: params.get('type') || '',
    maxPrice: params.get('maxPrice') || ''
  })

  const [filters, setFilters] = useState(readFilters)
  const [applied, setApplied] = useState(readFilters)
  const [selectedId, setSelectedId] = useState(params.get('unit') || '')
  const [sort, setSort] = useState(params.get('sort') || 'recommended')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  
  const [dbUnits, setDbUnits] = useState<RealCustomerUnit[]>([])
  const [loadingDb, setLoadingDb] = useState(true)

  const errorRef = useRef<HTMLDivElement>(null)
  const { error: loadError } = useBookings()
  const query = params.toString()

  useEffect(() => {
    async function loadData() {
      setLoadingDb(true)
      const data = await fetchCustomerUnitsFromDB()
      setDbUnits(data)
      setLoadingDb(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    const next = readFilters()
    if (JSON.stringify(next) !== JSON.stringify(applied)) setFilters(next)
    setApplied(next)
    setSelectedId(params.get('unit') || '')
    setSort(params.get('sort') || 'recommended')
    setError('')
  }, [query])

  useEffect(() => {
    const title = document.title
    document.title = 'Book Storage — Find your space | SelfStorage'
    return () => { document.title = title }
  }, [])

  // Map dữ liệu từ SQL Server sang giao diện card chuẩn giống trang booking
  const mappedUnits = dbUnits.map((u) => {
    let sizeCategory = 'medium'
    if (u.area <= 5 || (u.code && u.code.startsWith('S'))) sizeCategory = 'small'
    else if (u.area >= 20 || (u.code && u.code.startsWith('L'))) sizeCategory = 'large'

    // Xác định địa chỉ tương ứng với từng Facility/Chi nhánh
    const facilityName = u.facilityName || u.location || ''
    const isThuDuc = facilityName.toLowerCase().includes('thu duc') || facilityName.toLowerCase().includes('thủ đức')
    const dynamicAddress = isThuDuc ? 'Thủ Đức, TP.HCM' : 'Quận 1, TP.HCM'

    return {
      id: String(u.id || u.code),
      name: `Kho ${u.code} (${sizeCategory === 'small' ? 'Small Unit' : sizeCategory === 'medium' ? 'Medium Unit' : 'Large Unit'})`,
      facility: facilityName || 'SelfStorage District 1',
      address: dynamicAddress, // Cập nhật địa chỉ động ở đây
      area: u.area || 10,
      size: sizeCategory,
      type: u.type?.toLowerCase().includes('cold') ? 'cold' : 'standard',
      monthlyPrice: u.price || 1400000,
      available: u.status === 'Available',
      image: '/images/storage-hero.webp',
      description: `Không gian lưu trữ tiện lợi, an toàn và bảo mật tại ${facilityName || 'chi nhánh'}.`
    }
  })

  const filteredUnits = mappedUnits.filter((u) => {
    const matchLocation = !applied.location || u.facility.toLowerCase().includes(applied.location.toLowerCase()) || (applied.location === 'district-1' && u.facility.includes('District 1')) || (applied.location === 'thu-duc' && u.facility.includes('Thu Duc'))
    const matchSize = !applied.size || u.size === applied.size
    const matchType = !applied.type || u.type === applied.type
    const matchPrice = !applied.maxPrice || u.monthlyPrice <= Number(applied.maxPrice)
    return matchLocation && matchSize && matchType && matchPrice
  })

  if (sort !== 'recommended') {
    filteredUnits.sort((a, b) => sort === 'low' ? a.monthlyPrice - b.monthlyPrice : b.monthlyPrice - a.monthlyPrice)
  }

  const appliedError = filterError(applied)
  const issue = error || appliedError
  const dirty = JSON.stringify(filters) !== JSON.stringify(applied)

  function apply(event: FormEvent) {
    event.preventDefault()
    const message = filterError(filters)
    setError(message)
    if (message) return
    const next = filterParams(filters)
    if (sort !== 'recommended') next.set('sort', sort)
    setApplied({ ...filters })
    setSelectedId('')
    setNotice('Filters applied.')
    setParams(next, { replace: true })
  }

  function clear() {
    const next = freshFilters()
    setFilters(next)
    setApplied(next)
    setSelectedId('')
    setError('')
    setParams(filterParams(next), { replace: true })
  }

  function choose(id: string) {
    if (loadingDb || loadError || dirty || !filteredUnits.some(unit => unit.id === id && unit.available)) return
    const next = filterParams(applied)
    next.set('from', 'booking')
    next.set('unit', id)
    if (sort !== 'recommended') next.set('sort', sort)
    navigate(`/customer/book/${id}?${next}`)
  }

  const change = <K extends keyof SpaceFilters>(key: K, value: SpaceFilters[K]) => {
    setFilters(current => ({ ...current, [key]: value }))
    setError('')
  }

  return (
    <div className="customer-booking max-w-[1200px] pt-1 pb-10 text-slate-900 leading-relaxed mx-auto px-5">
      <nav className="flex items-center text-xs text-slate-500 py-5 gap-2.5" aria-label="Breadcrumb">
        <Link to="/">Home</Link><span>/</span><span aria-current="page">Book Storage</span>
      </nav>
      
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm" aria-labelledby="cb-filter-title">
        <h2 id="cb-filter-title" className="mb-4 text-base font-bold">Find your space</h2>
        <form onSubmit={apply} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <label className="flex flex-col gap-2">Facility location
              <select className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" value={filters.location} onChange={e => change('location', e.target.value)}>
                <option value="">All locations</option>
                <option value="district-1">District 1</option>
                <option value="thu-duc">Thu Duc</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">Storage size
              <select className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" value={filters.size} onChange={e => change('size', e.target.value)}>
                <option value="">All sizes</option>
                <option value="small">Small · 5 m²</option>
                <option value="medium">Medium · 10 m²</option>
                <option value="large">Large · 20 m²</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">Start date
              <input className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" type="date" min={localToday()} value={filters.startDate} onChange={e => change('startDate', e.target.value)} />
            </label>
            <label className="flex flex-col gap-2">Duration
              <select className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" value={filters.months} onChange={e => change('months', Number(e.target.value))}>
                {rentalDurations.map(m => <option key={m} value={m}>{m} months</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs">
            <span className="text-slate-500">{dirty ? 'You have changes. Apply filters.' : 'Showing available spaces.'}</span>
            <div>
              <button type="button" className="mr-3 font-semibold text-slate-600 hover:underline" onClick={clear}>Clear</button>
              <button className={styles.cbButton} type="submit">Apply filters</button>
            </div>
          </div>
        </form>
      </section>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold tracking-tight">Choose your storage unit</h1>
          <label className="flex items-center gap-2 text-xs">Sort by
            <select className="rounded-lg border border-slate-300 px-3 py-2 text-xs" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>

        {loadingDb ? (
          <p className="text-center py-10 text-slate-500">Đang tải danh sách kho từ cơ sở dữ liệu...</p>
        ) : filteredUnits.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <article key={unit.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                {/* HIỂN THỊ HÌNH ẢNH KHO GIỐNG TRANG BOOKING */}
                <div className="relative block h-[210px] overflow-hidden bg-slate-100">
                  <img src={unit.image} alt={unit.name} loading="lazy" className="h-full w-full object-cover" />
                  <span className={`absolute left-3.5 top-3.5 rounded bg-white px-2.5 py-1 text-[10px] font-semibold ${unit.available ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {unit.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold tracking-wider text-blue-600">{unit.facility}</span>
                  <h2 className="my-1.5 text-lg font-semibold">{unit.name}</h2>
                  <p className="text-xs text-slate-500">{unit.address}</p>
                  
                  {/* CÁC THẺ TAG DIỆN TÍCH VÀ LOẠI KHO */}
                  <div className="mt-3 flex flex-wrap gap-1.5 [&_span]:rounded [&_span]:border [&_span]:border-blue-100 [&_span]:bg-blue-50 [&_span]:px-2 [&_span]:py-0.5 [&_span]:text-[10px] [&_span]:font-medium [&_span]:text-blue-700">
                    <span>{unit.area} m²</span>
                    <span>{unit.type === 'cold' ? 'Cold storage' : 'Standard storage'}</span>
                  </div>
                  
                  <p className="mt-2 text-xs text-slate-500">{unit.description}</p>
                  
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                    <div>
                      <strong className="block text-base">{money(unit.monthlyPrice)}</strong>
                      <small className="text-[10px] text-slate-500">/ month</small>
                    </div>
                    <button className={`${styles.cbButton} px-3.5 py-2 text-xs`} type="button" disabled={!unit.available} onClick={() => choose(unit.id)}>
                      Choose unit →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-lg font-semibold">Không tìm thấy ô kho nào</h2>
            <p className="mt-2 text-sm text-slate-500">Hãy thử thay đổi bộ lọc hoặc tiêu chí tìm kiếm.</p>
            <button type="button" className="mt-4 inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={clear}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  )
}