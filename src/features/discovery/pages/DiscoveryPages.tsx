import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { money, storageUnits, sizeLabels, type StorageUnit, type StorageSize } from '../../booking/model/catalog'
import { isDate, isRentalDuration, localToday } from '../../booking/model/domain'
import { facilities, sizeGuide, startingPrice, faqItems } from '../model/data'
import { DiscoveryIcon } from '../components/PublicStorageLayout'

const styles = {
  button:
    'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-lg border border-blue-600 bg-blue-600 px-[18px] py-[11px] text-[13px] font-semibold text-white transition hover:border-blue-700 hover:bg-blue-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 [&_svg]:h-[17px] [&_svg]:w-[17px]',
  buttonSecondary:
    'inline-flex min-h-11 items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-[18px] py-[11px] text-[13px] font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 [&_svg]:h-[17px] [&_svg]:w-[17px]',
  empty:
    'mx-0 my-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center [&_p]:mx-0 [&_p]:mb-6 [&_p]:mt-3.5 [&_p]:text-slate-500',
  card:
    'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300',
  cardPhoto:
    'relative block h-[240px] overflow-hidden [&_img]:h-full [&_img]:w-full [&_img]:object-cover',
  badge:
    'absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-emerald-700',
  badgeMuted: 'bg-slate-100 text-slate-600',
  cardBody:
    'p-6 [&_h3]:mx-0 [&_h3]:mb-3 [&_h3]:mt-2 [&_h3]:text-[21px] [&_p]:mx-0 [&_p]:my-3 [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-slate-500',
  tags:
    'mx-0 my-4 flex flex-wrap gap-2 [&_span]:rounded-md bg-slate-50 px-2.5 py-[5px] text-[11px] text-slate-600',
  cardBottom:
    'mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-5 [&_strong]:block [&_strong]:text-xl [&_small]:block [&_small]:text-[11px] [&_small]:font-normal [&_small]:text-slate-500',
  filterPanel:
    'mb-[30px] flex flex-wrap items-end gap-4 rounded-[14px] border border-slate-200 bg-white p-[18px] sm:gap-5 sm:p-[22px] [&>label]:min-w-[130px] [&>label]:flex-1',
  sectionHeading:
    'mx-0 mb-[22px] mt-7 flex flex-wrap items-center justify-between gap-3 sm:gap-5 [&_p]:mt-2 [&_p]:text-[13px] [&_p]:text-slate-500',
  panel:
    'mb-6 rounded-2xl border border-slate-200 bg-white p-[22px] sm:p-7 [&>p]:mx-0 [&>p]:my-3.5 [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-slate-500 [&_h2]:mb-4',
  featureGrid:
    'grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 [&>div>svg]:mx-0 [&>div>svg]:my-[15px] [&>div>svg]:text-blue-600 [&_h3]:mx-0 [&_h3]:my-2 [&_p]:text-xs [&_p]:leading-relaxed [&_p]:text-slate-500',
  specs:
    'mx-0 my-5 text-[13px] [&>div]:flex [&>div]:justify-between [&>div]:gap-4 [&>div]:border-b [&>div]:border-slate-100 [&>div]:py-[13px] [&_dt]:text-slate-500 [&_dd]:m-0 [&_dd]:max-w-[65%] [&_dd]:text-right [&_dd]:font-semibold',
  checkList:
    'mx-0 my-4 list-none p-0 [&_li]:mx-0 [&_li]:my-3 [&_li]:flex [&_li]:items-start [&_li]:gap-2.5 [&_li]:text-[13px] [&_li]:text-slate-500 [&_svg]:mt-px [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:shrink-0 [&_svg]:text-blue-600',
  eyebrow: 'text-[10px] font-bold tracking-[1.8px] text-blue-700',
  link: 'inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-blue-700 [&_svg]:h-[17px] [&_svg]:w-[17px]',
} as const

function usePage(title: string) {
  useEffect(() => {
    const previousTitle = document.title
    const previousLang = document.documentElement.lang
    document.title = `${title} | SelfStorage`
    document.documentElement.lang = 'en'
    return () => {
      document.title = previousTitle
      document.documentElement.lang = previousLang
    }
  }, [title])
}

function Breadcrumb({ children }: { children: ReactNode }) {
  return (
    <nav className="flex flex-wrap gap-2.5 px-0 py-7 text-xs text-slate-500 max-[767px]:py-[22px]" aria-label="Breadcrumb">
      <Link to="/" className="hover:underline">Home</Link>
      <span aria-hidden="true">/</span>
      {children}
    </nav>
  )
}

function Intro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <div className="max-w-[740px] px-0 pb-9 pt-3 max-[767px]:pb-7 [&>p]:max-w-[620px] [&>p]:text-[15px] [&>p]:leading-relaxed [&>p]:text-slate-500">
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  )
}

function SampleNote() {
  return (
    <p className="mx-0 my-[18px] text-xs leading-relaxed text-slate-500">
      Information, images and prices are illustrative. Confirm actual location, rental terms and availability with the facility.
    </p>
  )
}

function ContactBanner() {
  return (
    <section className="mx-0 my-[50px] flex items-center justify-between gap-[30px] rounded-[18px] bg-blue-50 p-[34px] max-[767px]:my-9 max-[767px]:flex-col max-[767px]:items-start max-[767px]:p-[26px] [&_h2]:mx-0 [&_h2]:my-2.5 [&_p]:text-[13px] [&_p]:text-slate-500">
      <div>
        <span className={styles.eyebrow}>A LITTLE ADVICE. A BETTER FIT.</span>
        <h2>Not sure which space fits?</h2>
        <p>Tell us what you need to store and get advice before booking.</p>
      </div>
      <a className={styles.button} href="tel:+84909149563">
        Call 0909 149 563 <DiscoveryIcon name="arrow" />
      </a>
    </section>
  )
}

function NotFound({ unit = false }: { unit?: boolean }) {
  return (
    <div className={styles.empty}>
      <h1>{unit ? 'Unit not found' : 'Facility not found'}</h1>
      <p>This link may no longer be valid. Please choose a storage facility.</p>
      <Link className={styles.button} to="/facilities">View facility</Link>
    </div>
  )
}

function bookingPath(unit: StorageUnit, params = new URLSearchParams()) {
  const next = new URLSearchParams(params)
  const startDate = params.get('startDate') || ''
  const months = Number(params.get('months'))
  next.set('startDate', isDate(startDate) && startDate >= localToday() ? startDate : localToday())
  next.set('months', String(isRentalDuration(months) ? months : 1))
  next.set('location', unit.location)
  next.set('size', unit.size)
  next.set('unit', unit.id)
  next.set('from', 'booking')
  return `/customer/book/${encodeURIComponent(unit.id)}?${next}`
}

function UnitCard({ unit }: { unit: StorageUnit }) {
  const [params] = useSearchParams()
  const target = unit.available ? bookingPath(unit, params) : `/storage/${unit.id}`
  return (
    <article className={styles.card}>
      <Link className={styles.cardPhoto} to={target}>
        <img src={unit.image} alt={unit.name} loading="lazy" />
        <span className={`${styles.badge} ${!unit.available ? styles.badgeMuted : ''}`}>
          {unit.available ? 'Available to select' : 'Not accepting bookings'}
        </span>
      </Link>
      <div className={styles.cardBody}>
        <span className={styles.eyebrow}>{unit.facility}</span>
        <h3><Link to={target}>{unit.name}</Link></h3>
        <div className={styles.tags}>
          <span>{unit.area} m²</span>
          <span>{unit.type === 'cold' ? 'Cold storage' : 'Standard storage'}</span>
        </div>
        <p>{unit.description}</p>
        <div className={styles.cardBottom}>
          <div>
            <strong>{money(unit.monthlyPrice)}</strong>
            <small>/ month · sample price</small>
          </div>
          <Link className={styles.link} to={target}>
            {unit.available ? 'Book this unit' : 'View details'} <DiscoveryIcon name="arrow" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function FacilitiesPage() {
  usePage('Facilities')
  const [params, setParams] = useSearchParams()
  const district = params.get('location') || ''
  const size = params.get('size') || ''
  const filtered = facilities.filter(
    (f) => (!district || f.id === district) && (!size || storageUnits.some((u) => u.location === f.id && u.size === size)),
  )
  function filter(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  return (
    <>
      <Breadcrumb><span aria-current="page">Facilities</span></Breadcrumb>
      <section className="mb-7 grid grid-cols-1 overflow-hidden rounded-[22px] bg-blue-50 max-[767px]:[&>img]:h-[200px] max-[767px]:[&>img]:min-h-0 sm:grid-cols-[1.1fr_1fr] [&>img]:h-full [&>img]:min-h-[310px] [&>img]:w-full [&>img]:object-cover">
        <Intro eyebrow="CLOSE TO YOU. RIGHT FOR YOU." title="Find more space. Close to home.">
          Explore facilities in Ho Chi Minh City and find a place for your belongings and your next chapter.
        </Intro>
        <img src="/images/storage-hero.webp" alt="Storage corridor with blue unit doors" />
      </section>
      <div className={styles.filterPanel}>
        <label>
          Location
          <select value={district} onChange={(e) => filter('location', e.target.value)}>
            <option value="">All locations</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>{f.district}</option>
            ))}
          </select>
        </label>
        <label>
          Unit size
          <select value={size} onChange={(e) => filter('size', e.target.value)}>
            <option value="">All sizes</option>
            {sizeGuide.map((s) => (
              <option key={s.size} value={s.size}>{sizeLabels[s.size]} · {s.area} m²</option>
            ))}
          </select>
        </label>
        <button type="button" className={styles.buttonSecondary} onClick={() => setParams({})}>Clear filters</button>
      </div>
      <div className={styles.sectionHeading}>
        <div>
          <h2>Storage facilities</h2>
          <p role="status">{filtered.length} matching facilities</p>
        </div>
        <Link className={styles.link} to="/pricing">Compare sizes <DiscoveryIcon name="arrow" /></Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filtered.map((f) => {
          const units = storageUnits.filter((u) => u.location === f.id)
          return (
            <article className={styles.card} key={f.id}>
              <Link className={styles.cardPhoto} to={`/facilities/${f.id}`}>
                <img src={f.image} alt={`Illustrative storage space at ${f.name}`} loading="lazy" />
                <span className={styles.badge}>{f.district}</span>
              </Link>
              <div className={styles.cardBody}>
                <h2><Link to={`/facilities/${f.id}`}>{f.name}</Link></h2>
                <p className="flex items-center gap-2 [&_svg]:h-[17px] [&_svg]:w-[17px] [&_svg]:shrink-0">
                  <DiscoveryIcon name="pin" />{f.address}
                </p>
                <p>{f.description}</p>
                <div className={styles.tags}>
                  {[...new Set(units.map((u) => u.area))].map((a) => <span key={a}>{a} m²</span>)}
                  <span>{units.length} sample unit options</span>
                </div>
                <div className={styles.cardBottom}>
                  <div>
                    <small>Sample prices from</small>
                    <strong>{money(startingPrice(f.id)!)}<small>/ month</small></strong>
                  </div>
                  <Link className={styles.buttonSecondary} to={`/facilities/${f.id}`}>
                    View facility <DiscoveryIcon name="arrow" />
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      {!filtered.length && (
        <div className={styles.empty}>
          <h2>No matching facilities</h2>
          <p>Try changing the location or unit size.</p>
          <button type="button" className={styles.button} onClick={() => setParams({})}>Clear filters</button>
        </div>
      )}
      <SampleNote />
      <ContactBanner />
    </>
  )
}

export function FacilityDetailsPage() {
  const { facilityId } = useParams()
  const facility = facilities.find((f) => f.id === facilityId)
  usePage(facility?.name || 'Facility not found')
  const [size, setSize] = useState('')
  const [available, setAvailable] = useState(false)
  if (!facility) return <NotFound />
  const all = storageUnits.filter((u) => u.location === facility.id)
  const units = all.filter((u) => (!size || u.size === size) && (!available || u.available))
  return (
    <>
      <Breadcrumb>
        <Link to="/facilities">Facilities</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{facility.district}</span>
      </Breadcrumb>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>SPACE FOR YOUR NEXT CHAPTER</span>
          <h1>{facility.name}</h1>
          <p className="flex items-center gap-2 [&_svg]:h-[17px] [&_svg]:w-[17px] [&_svg]:shrink-0">
            <DiscoveryIcon name="pin" />{facility.address}
          </p>
        </div>
        <a className={styles.buttonSecondary} href="tel:+84909149563">Contact facility</a>
      </div>
      <img
        className="mb-[30px] h-[240px] w-full rounded-[18px] object-cover max-[767px]:h-[240px] sm:h-[360px]"
        src={facility.image}
        alt={`Illustrative facility image ${facility.district}`}
      />
      <div className="mx-auto my-0 max-w-[1000px]">
        <section className={styles.panel}>
          <h2>A place for your belongings</h2>
          <p>{facility.description}</p>
          <div className={styles.featureGrid}>
            <div>
              <DiscoveryIcon name="box" />
              <h3>A choice of sizes</h3>
              <p>{[...new Set(all.map((u) => u.area))].join(' / ')} m² sample sizes.</p>
            </div>
            <div>
              <DiscoveryIcon name="calendar" />
              <h3>Flexible rental periods</h3>
              <p>Choose a rental of 1, 3, 6, 12 or 24 months.</p>
            </div>
            <div>
              <DiscoveryIcon name="help" />
              <h3>Here to help</h3>
              <p>Discuss storage conditions and handover.</p>
            </div>
          </div>
        </section>
        <section className={styles.panel}>
          <h2>Before you visit</h2>
          <dl className={styles.specs}>
            <div><dt>Location</dt><dd>{facility.address}</dd></div>
            <div><dt>Full address</dt><dd>Contact us to confirm</dd></div>
            <div><dt>Access hours</dt><dd>Confirm with the facility before visiting</dd></div>
            <div><dt>Handover & moving</dt><dd>Discuss your schedule and support needs</dd></div>
          </dl>
        </section>
      </div>
      <section id="facility-units" className="mx-0 my-11 scroll-mt-[110px]">
        <div className={styles.sectionHeading}>
          <div>
            <h2>Units in {facility.district}</h2>
            <p role="status">{units.length} matching options</p>
          </div>
        </div>
        <div className={`${styles.filterPanel} max-w-[600px]`}>
          <label>
            Size
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="">All sizes</option>
              {sizeGuide.map((s) => (
                <option key={s.size} value={s.size}>{s.area} m²</option>
              ))}
            </select>
          </label>
          <label className="flex min-h-11 items-center gap-2.5">
            <input
              type="checkbox"
              className="h-[17px] w-[17px] accent-blue-600"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            Available preview units only
          </label>
        </div>
        <div className="grid grid-cols-1 gap-6 max-[480px]:grid-cols-1 max-[767px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {units.map((u) => <UnitCard key={u.id} unit={u} />)}
        </div>
        {!units.length && (
          <div className={styles.empty}>
            <h3>No units match your filters</h3>
            <button type="button" className={styles.buttonSecondary} onClick={() => { setSize(''); setAvailable(false) }}>
              Clear filters
            </button>
          </div>
        )}
      </section>
      <ContactBanner />
    </>
  )
}

export function StorageUnitDetailsPage() {
  const { unitId } = useParams()
  const unit = storageUnits.find((u) => u.id === unitId)
  usePage(unit?.name || 'Unit not found')
  if (!unit) return <NotFound unit />
  const guide = sizeGuide.find((s) => s.size === unit.size)!
  return (
    <>
      <Breadcrumb>
        <Link to="/facilities">Facility</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/facilities/${unit.location}`}>{unit.facility}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{unit.name}</span>
      </Breadcrumb>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>A SPACE OF YOUR OWN</span>
          <h1>{unit.name}</h1>
          <p>{unit.facility} · {unit.area} m² · {unit.type === 'cold' ? 'Cold storage' : 'Standard storage'}</p>
        </div>
        <span className={`rounded-full px-3 py-2 text-[11px] font-semibold ${unit.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {unit.available ? 'Available in the preview catalog' : 'Not accepting bookings'}
        </span>
      </div>
      <div className="mx-auto my-0 max-w-[1000px]">
        <img
          className="mb-6 h-[280px] w-full rounded-[18px] object-cover sm:h-[390px] lg:h-[440px]"
          src={unit.image}
          alt={`Illustrative image ${unit.name}`}
        />
        <section className={styles.panel}>
          <h2>Is this space right for you?</h2>
          <p>{unit.description}</p>
          <div className={styles.tags}>
            <span>{unit.area} m² sample floor area</span>
            <span>{sizeLabels[unit.size]}</span>
            <span>{unit.type === 'cold' ? 'Confirm temperature requirements' : 'General storage'}</span>
          </div>
          <h3 className="mx-0 mb-4 mt-6">Suggested items</h3>
          <ul className={styles.checkList}>
            {guide.items.map((i) => (
              <li key={i}><DiscoveryIcon name="check" />{i}</li>
            ))}
          </ul>
          <p className="mx-0 my-[18px] text-xs leading-relaxed text-slate-500">
            Capacity depends on item sizes and packing. Confirm unit dimensions and storage conditions with the facility.
          </p>
          <Link className={styles.link} to="/pricing">Compare other sizes <DiscoveryIcon name="arrow" /></Link>
        </section>
        <section className={styles.panel}>
          <h2>Using your storage unit</h2>
          <ul className={styles.checkList}>
            <li><DiscoveryIcon name="check" />Measure large items and list your belongings.</li>
            <li><DiscoveryIcon name="check" />Discuss access hours, moving and handover.</li>
            <li><DiscoveryIcon name="check" />Confirm rental terms, deposits and fees.</li>
          </ul>
          <Link className={styles.link} to="/how-it-works">View the process & FAQs</Link>
        </section>
      </div>
      <section className="mx-0 my-11 scroll-mt-[110px]">
        <div className={styles.sectionHeading}><h2>More units at this facility</h2></div>
        <div className="grid grid-cols-1 gap-6 max-[480px]:grid-cols-1 max-[767px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {storageUnits
            .filter((u) => u.location === unit.location && u.id !== unit.id)
            .slice(0, 3)
            .map((u) => <UnitCard key={u.id} unit={u} />)}
        </div>
      </section>
      <ContactBanner />
    </>
  )
}

export function PricingSizeGuidePage() {
  usePage('Pricing & Size Guide')
  const [selectedUnits, setSelectedUnits] = useState<Partial<Record<StorageSize, string>>>({})
  const availableUnits = (size: StorageSize) =>
    storageUnits.filter((unit) => unit.available && unit.size === size).sort((a, b) => a.monthlyPrice - b.monthlyPrice)
  const selectedUnit = (size: StorageSize) =>
    availableUnits(size).find((unit) => unit.id === selectedUnits[size]) || availableUnits(size)[0]
  const formatCost = (amount?: number) => (amount === undefined ? 'Unavailable' : money(amount))
  return (
    <>
      <Breadcrumb><span aria-current="page">Pricing & Size Guide</span></Breadcrumb>
      <Intro eyebrow="THE RIGHT SIZE. CLEAR COSTS." title="A size for every need.">
        From a few boxes to a whole home. Compare sizes and plan your budget before choosing your space.
      </Intro>
      <div className="grid grid-cols-1 gap-6 max-[480px]:grid-cols-1 max-[767px]:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {sizeGuide.map((s) => {
          const units = availableUnits(s.size)
          const unit = selectedUnit(s.size)
          return (
            <article className={styles.card} key={s.size}>
              <img src={s.image} alt={`Illustrative storage unit ${s.area} square metres`} className="h-[190px] w-full object-cover" />
              <div className={styles.cardBody}>
                <span className={styles.eyebrow}>{sizeLabels[s.size]}</span>
                <h2 className="mx-0 my-3 text-[46px]">{s.area} <small className="text-xl text-slate-500">m²</small></h2>
                <h3 className="text-lg">{s.title}</h3>
                <p>{s.use}</p>
                <ul className={styles.checkList}>
                  {s.items.map((i) => (
                    <li key={i}><DiscoveryIcon name="check" />{i}</li>
                  ))}
                </ul>
                <div className="mt-[22px] border-t border-slate-200 px-0 py-5 [&_small]:block [&_small]:text-[11px] [&_small]:text-slate-500 [&_strong]:text-2xl">
                  <small>Monthly rent</small>
                  <strong>{formatCost(unit?.monthlyPrice)}</strong>
                  <small>/ month</small>
                </div>
                <label className="mb-4 mt-5 block text-xs font-semibold text-slate-700" htmlFor={`pricing-unit-${s.size}`}>
                  Location & unit
                  <select
                    id={`pricing-unit-${s.size}`}
                    className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    value={unit?.id || ''}
                    disabled={!units.length}
                    onChange={(event) => setSelectedUnits((current) => ({ ...current, [s.size]: event.target.value }))}
                  >
                    {units.length
                      ? units.map((option) => (
                          <option key={option.id} value={option.id}>{option.facility} · {option.name}</option>
                        ))
                      : <option value="">No available units</option>}
                  </select>
                </label>
                {unit ? (
                  <Link className={`${styles.buttonSecondary} w-full`} to={bookingPath(unit)}>
                    Book {s.area} m² <DiscoveryIcon name="arrow" />
                  </Link>
                ) : (
                  <button type="button" className="min-h-11 w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 py-3 text-sm text-slate-500" disabled>
                    No available units
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
      <SampleNote />
      <section className="mx-0 my-11 scroll-mt-[110px]">
        <div className={styles.sectionHeading}><h2>Find the right size</h2></div>
        <div className={styles.featureGrid}>
          <div className={styles.panel}>
            <DiscoveryIcon name="ruler" />
            <h3>Measure before choosing</h3>
            <p>Measure large items and check whether furniture can be disassembled.</p>
          </div>
          <div className={styles.panel}>
            <DiscoveryIcon name="box" />
            <h3>Leave room for access</h3>
            <p>Keep frequently used items near the front and leave room to move.</p>
          </div>
          <div className={styles.panel}>
            <DiscoveryIcon name="help" />
            <h3>Ask the facility</h3>
            <p>Share your item list for advice on capacity and storage conditions.</p>
          </div>
        </div>
      </section>
      <ContactBanner />
    </>
  )
}

export function HowItWorksPage() {
  usePage('How It Works / FAQ')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const filtered = faqItems.filter(
    (f) =>
      (category === 'all' || f.category === category) &&
      `${f.question} ${f.answer}`.toLocaleLowerCase('en').includes(search.trim().toLocaleLowerCase('en')),
  )
  const steps = [
    { icon: 'pin', title: 'Find your space', text: 'Explore facilities, compare sizes and review unit details.', to: '/facilities', cta: 'Explore facilities' },
    { icon: 'calendar', title: 'Plan your rental', text: 'Choose your rental period, enter your details and review estimated costs.', to: '/booking', cta: 'Start booking' },
    { icon: 'box', title: 'Confirm & move in', text: 'For a real rental, agree on the contract and handover schedule with the facility before bringing your belongings.', to: '/how-it-works#checklist', cta: 'View preparation checklist' },
  ]
  return (
    <>
      <Breadcrumb><span aria-current="page">How It Works / FAQ</span></Breadcrumb>
      <Intro eyebrow="FROM SEARCH TO SETTLED" title="Start simply. Store with confidence.">
        Understand each step and what to confirm as you prepare for your new space.
      </Intro>
      <ol className="mx-0 mb-11 mt-3 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-3 sm:gap-6 [&_h2]:text-[21px] [&_p]:min-h-0 sm:[&_p]:min-h-[84px]">
        {steps.map((s, i) => (
          <li className={styles.panel} key={s.title}>
            <div className="mb-6 flex items-center justify-between text-[26px] font-bold text-slate-400 max-[767px]:mb-[18px]">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <DiscoveryIcon name={s.icon} />
              </span>
              <span>0{i + 1}</span>
            </div>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
            <Link className={styles.link} to={s.to}>{s.cta} <DiscoveryIcon name="arrow" /></Link>
          </li>
        ))}
      </ol>
      <section
        id="checklist"
        className="mx-0 my-11 grid scroll-mt-[110px] grid-cols-1 gap-5 rounded-[18px] bg-blue-50 p-6 sm:grid-cols-2 sm:gap-10 sm:p-9 [&_h2]:mx-0 [&_h2]:my-3 [&_h2]:text-[29px] [&_p]:text-[13px] [&_p]:text-slate-500"
      >
        <div>
          <span className={styles.eyebrow}>READY FOR MOVING DAY</span>
          <h2>A little preparation,<br />a smoother moving day.</h2>
          <p>Contact the facility to confirm your handover requirements.</p>
        </div>
        <ul className={styles.checkList}>
          <li><DiscoveryIcon name="check" />List your items and measure large belongings.</li>
          <li><DiscoveryIcon name="check" />Pack, label and protect fragile items.</li>
          <li><DiscoveryIcon name="check" />Check rental terms, deposit and end date.</li>
          <li><DiscoveryIcon name="check" />Confirm the address, access hours and moving schedule.</li>
        </ul>
      </section>
      <section className="mx-0 my-11 scroll-mt-[110px]" id="faq">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>ANSWERS BEFORE YOU BEGIN</span>
            <h2>Frequently asked questions</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-5 [&>label]:min-w-[240px] [&>label]:flex-1 max-[767px]:[&>label]:min-w-0 max-[767px]:[&>label]:basis-full">
          <label>
            <span className="sr-only absolute h-px w-px overflow-hidden [clip-path:inset(50%)]">Search questions</span>
            <input
              type="search"
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
              placeholder="Search booking, pricing, access…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="FAQ topics">
            {[
              { id: 'all', name: 'All' },
              { id: 'booking', name: 'Book Storage' },
              { id: 'sizes', name: 'Size' },
              { id: 'pricing', name: 'Pricing' },
              { id: 'access', name: 'Using storage' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`min-h-11 cursor-pointer rounded-lg border px-3.5 py-[9px] text-xs ${
                  category === c.id ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <p className="mx-0 my-[18px] text-xs leading-relaxed text-slate-500" role="status">
          {filtered.length} matching questions
        </p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {filtered.map((f) => (
            <details key={f.question} className="border-b border-slate-100 last:border-0 open:bg-blue-50/40">
              <summary className="flex cursor-pointer list-none justify-between gap-4 px-5 py-5 text-sm font-semibold sm:px-6 sm:py-[22px] [&::-webkit-details-marker]:hidden">
                {f.question}
                <span className="text-[22px] leading-none text-blue-600" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-[900px] px-5 pb-5 text-[13px] leading-relaxed text-slate-500 sm:px-6 sm:pb-6">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
        {!filtered.length && (
          <div className={styles.empty}>
            <h3>No questions found</h3>
            <p>Try another keyword or contact our support team.</p>
            <button type="button" className={styles.buttonSecondary} onClick={() => { setSearch(''); setCategory('all') }}>
              Clear search
            </button>
          </div>
        )}
      </section>
      <ContactBanner />
    </>
  )
}