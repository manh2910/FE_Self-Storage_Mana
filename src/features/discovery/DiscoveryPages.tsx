import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { money, storageUnits, sizeLabels, type StorageUnit, type StorageSize } from '../booking/catalog'
import { isDate, isRentalDuration, localToday } from '../booking/domain'
import { facilities, sizeGuide, startingPrice, faqItems } from './data'
import { DiscoveryIcon } from './PublicStorageLayout'

// Shared Tailwind utilities stay beside the components that use them.
const styles = {
  dsButton: [
    "inline-flex items-center justify-center min-h-11 bg-none bg-[color:var(--ds-primary)] bg-clip-border",
    "text-[color:white] text-[length:13px] font-[650] cursor-pointer [transition:background_.2s,border-color_.2s]",
    "px-[18px] py-[11px] gap-2.5 rounded-[9px] border border-solid border-[color:var(--ds-primary)] [&:hover]:bg-none",
    "[&:hover]:bg-[color:#1d4ed8] [&:hover]:bg-clip-border [&:hover]:border-[color:#1d4ed8] [&.secondary]:bg-none",
    "[&.secondary]:bg-[color:white] [&.secondary]:bg-clip-border [&.secondary]:text-[color:#1d4ed8]",
    "[&.secondary]:border-[color:#b8c9e3] [&.secondary:hover]:bg-none [&.secondary:hover]:bg-[color:#eff6ff]",
    "[&.secondary:hover]:bg-clip-border [&:disabled]:bg-none [&:disabled]:bg-[color:#e2e8f0] [&:disabled]:bg-clip-border",
    "[&:disabled]:text-[color:var(--ds-muted)] [&:disabled]:cursor-not-allowed [&:disabled]:border-[color:var(--ds-line)]",
    "[&_svg]:w-[17px] [&_svg]:h-[17px] [.ds-contact-banner_&]:shrink-0 [.ds-sticky_&]:w-full [.ds-sticky_&]:mx-0",
    "[.ds-sticky_&]:my-2.5 [.ds-size-card_&]:w-full [.ds-calculator_&]:w-full [.ds-empty_&]:mt-4",
    "max-[767px]:[.ds-header-actions_&]:text-[length:12px] max-[767px]:[.ds-header-actions_&]:px-3",
    "max-[767px]:[.ds-header-actions_&]:py-[9px] max-[767px]:[.ds-filter-panel>&]:w-full",
    "max-[480px]:[.ds-contact-banner_&]:w-full max-[720px]:[.fm-header-inner_&]:text-[length:11px]",
    "max-[720px]:[.fm-header-inner_&]:px-3 max-[720px]:[.fm-header-inner_&]:py-2.5",
    "max-[720px]:[.shared-header_.ds-header-actions_&]:text-[length:10px]",
    "max-[720px]:[.shared-header_.ds-header-actions_&]:p-2.5",
    "max-[720px]:[.shared-header_.ds-header-actions>.ds-button.secondary~&]:hidden",
    "max-[720px]:[.shared-header_.ds-header-actions>&.secondary]:whitespace-nowrap",
    "[.shared-header.midnight-header_&]:bg-none [.shared-header.midnight-header_&]:bg-[color:#2563eb]",
    "[.shared-header.midnight-header_&]:bg-clip-border [.shared-header.midnight-header_&]:text-[color:#fff]",
    "[.shared-header.midnight-header_&]:[transition:background_.2s_ease,border-color_.2s_ease,box-shadow_.2s_ease]",
    "[.shared-header.midnight-header_&]:border-[color:#3b82f6] [.shared-header.midnight-header_&:hover]:bg-none",
    "[.shared-header.midnight-header_&:hover]:bg-[color:#1d4ed8] [.shared-header.midnight-header_&:hover]:bg-clip-border",
    "[.shared-header.midnight-header_&:hover]:[box-shadow:0_0_18px_#2563eb30]",
    "[.shared-header.midnight-header_&.secondary]:bg-none",
    "[.shared-header.midnight-header_&.secondary]:bg-[color:#ffffff55]",
    "[.shared-header.midnight-header_&.secondary]:bg-clip-border",
    "[.shared-header.midnight-header_&.secondary]:text-[color:#172a46]",
    "[.shared-header.midnight-header_&.secondary]:border-[color:#8194ad70]",
    "[.shared-header.midnight-header_&.secondary:hover]:bg-none",
    "[.shared-header.midnight-header_&.secondary:hover]:bg-[color:#ffffff99]",
    "[.shared-header.midnight-header_&.secondary:hover]:bg-clip-border",
    "[.shared-header.midnight-header_&.secondary:hover]:text-[color:#1e40af]",
    "[.shared-header.midnight-header_&.secondary:hover]:border-[color:#2563eb]",
    "[.shared-header.booking-navigation_&.booking-nav-cta]:bg-[image:linear-gradient(115deg,#2563eb,#1d4ed8)]",
    "[.shared-header.booking-navigation_&.booking-nav-cta]:bg-[color:transparent]",
    "[.shared-header.booking-navigation_&.booking-nav-cta]:bg-clip-border",
    "[.shared-header.booking-navigation_&.booking-nav-cta]:[box-shadow:0_4px_14px_#2563eb20]",
    "[.shared-header.booking-navigation_&.booking-nav-cta]:border-[color:#3b82f6]",
    "max-[520px]:[.fm-units-heading_&]:w-full max-[520px]:[.fm-dialog-actions_&]:flex-1",
  ].join(' '),
  dsEmpty: [
    "text-center bg-none bg-[color:white] bg-clip-border px-6 py-16 mx-0 my-6 rounded-[16px] border border-dashed",
    "border-[color:var(--ds-line)] [&_p]:mt-3.5 [&_p]:mb-6 [&_p]:text-[color:var(--ds-muted)] [&_p]:mx-0",
  ].join(' '),
  dsCard: [
    "bg-none bg-[color:white] bg-clip-border overflow-hidden [box-shadow:0_3px_16px_#14263d04]",
    "[transition:border-color_.2s] rounded-[16px] border border-solid border-[color:var(--ds-line)]",
    "[&:hover]:border-[color:#a0b6d7]",
  ].join(' '),
  dsCardPhoto: [
    "block relative h-[240px] overflow-hidden [&_img]:w-full [&_img]:h-full [&_img]:object-cover",
    "[.ds-unit-grid_&]:h-[190px] max-[480px]:[.ds-facility-grid_&]:h-[210px]",
  ].join(' '),
  dsBadge: [
    "absolute top-4 left-4 bg-none bg-[color:white] bg-clip-border text-[color:#166534] text-[length:11px] font-[650]",
    "px-3 py-1.5 rounded-[20px] [&.muted]:bg-none [&.muted]:bg-[color:#f1f5f9] [&.muted]:bg-clip-border",
    "[&.muted]:text-[color:#475569]",
  ].join(' '),
  dsCardBody: [
    "p-6 [&_h3]:mt-2 [&_h3]:mb-3 [&_h3]:text-[length:21px] [&_h3]:mx-0 [&_p]:text-[length:13px]",
    "[&_p]:text-[color:var(--ds-muted)] [&_p]:leading-[1.8] [&_p]:mx-0 [&_p]:my-3 [.ds-unit-grid_&]:p-5",
    "[.ds-unit-grid_&>p]:min-h-[47px]",
  ].join(' '),
  dsTags: [
    "flex flex-wrap mx-0 my-4 gap-2 [&_span]:text-[length:11px] [&_span]:bg-none [&_span]:bg-[color:var(--ds-soft)]",
    "[&_span]:bg-clip-border [&_span]:text-[color:#36506d] [&_span]:px-2.5 [&_span]:py-[5px] [&_span]:rounded-[6px]",
  ].join(' '),
  dsCardBottom: [
    "flex items-center justify-between [border-top-width:1px] [border-top-style:solid] [border-top-color:var(--ds-line)]",
    "pt-5 mt-5 gap-3 [&_strong]:text-[length:20px] [&_strong]:block [&_small]:block [&_small]:text-[length:11px]",
    "[&_small]:font-normal [&_small]:text-[color:var(--ds-muted)] max-[1100px]:flex-wrap",
  ].join(' '),
  dsFilterPanel: [
    "flex [align-items:end] bg-none bg-[color:white] bg-clip-border mb-[30px] p-[22px] gap-5 rounded-[14px] border",
    "border-solid border-[color:var(--ds-line)] [&>label]:flex-1 [&.compact]:max-w-[600px] [.ds-calculator_&]:bg-none",
    "[.ds-calculator_&]:bg-[color:transparent] [.ds-calculator_&]:bg-clip-border [.ds-calculator_&]:p-0",
    "[.ds-calculator_&]:mx-0 [.ds-calculator_&]:my-6 [.ds-calculator_&]:border-[length:0px]",
    "[.ds-calculator_&]:border-none [.ds-calculator_&]:border-[color:currentColor] max-[767px]:flex-wrap",
    "max-[767px]:p-[18px] max-[767px]:gap-4 max-[767px]:[&>label]:min-w-[130px]",
    "max-[767px]:[.ds-calculator_&]:flex-nowrap max-[480px]:[&.compact]:items-center",
  ].join(' '),
  dsSectionHeading: [
    "flex items-center justify-between mt-7 mb-[22px] mx-0 gap-5 [&_p]:text-[length:13px]",
    "[&_p]:text-[color:var(--ds-muted)] [&_p]:mt-2 max-[767px]:flex-wrap max-[767px]:gap-3",
    "max-[767px]:[&_h1]:text-[length:30px]",
  ].join(' '),
  dsPanel: [
    "bg-none bg-[color:white] bg-clip-border mb-6 p-7 rounded-[16px] border border-solid border-[color:var(--ds-line)]",
    "[&>p]:text-[length:14px] [&>p]:text-[color:var(--ds-muted)] [&>p]:leading-[1.85] [&>p]:mx-0 [&>p]:my-3.5 [&_h2]:mb-4",
    "[.ds-feature-grid_&]:m-0 [.ds-calculator_&]:m-0 [.ds-process_&]:m-0 max-[767px]:p-[22px]",
    "max-[767px]:[.ds-process_&]:p-6 max-[767px]:[.ds-feature-grid>&]:p-4",
  ].join(' '),
  dsFeatureGrid: [
    "grid grid-cols-3 gap-5 [&>div>svg]:text-[color:var(--ds-primary)] [&>div>svg]:mx-0 [&>div>svg]:my-[15px] [&_h3]:mx-0",
    "[&_h3]:my-2 [&_p]:text-[length:12px] [&_p]:leading-[1.8] [&_p]:text-[color:var(--ds-muted)] max-[767px]:gap-3.5",
    "max-[767px]:[&_h3]:text-[length:14px] max-[767px]:[&_p]:text-[length:11px] max-[480px]:grid-cols-[1fr]",
    "max-[480px]:[&>div]:[border-bottom-width:1px] max-[480px]:[&>div]:[border-bottom-style:solid]",
    "max-[480px]:[&>div]:[border-bottom-color:var(--ds-line)] max-[480px]:[&>div]:pb-3",
    "max-[480px]:[&>div:last-child]:border-[length:0px] max-[480px]:[&>div:last-child]:border-none",
    "max-[480px]:[&>div:last-child]:border-[color:currentColor] max-[480px]:[&>div>svg]:mx-0 max-[480px]:[&>div>svg]:my-2",
    "max-[480px]:[&_p]:text-[length:13px] max-[480px]:[&_h3]:text-[length:16px]",
  ].join(' '),
  dsSpecs: [
    "text-[length:13px] mx-0 my-5 [&>div]:flex [&>div]:justify-between [&>div]:[border-bottom-width:1px]",
    "[&>div]:[border-bottom-style:solid] [&>div]:[border-bottom-color:#edf1f6] [&>div]:px-0 [&>div]:py-[13px]",
    "[&>div]:gap-6 [&_dt]:text-[color:var(--ds-muted)] [&_dd]:text-right [&_dd]:font-semibold [&_dd]:max-w-[65%]",
    "[&_dd]:m-0 max-[480px]:[&>div]:text-[length:12px] max-[480px]:[&>div]:gap-3",
  ].join(' '),
  dsCheckList: [
    "list-none p-0 mx-0 my-4 [&_li]:flex [&_li]:items-start [&_li]:text-[length:13px] [&_li]:text-[color:var(--ds-muted)]",
    "[&_li]:mx-0 [&_li]:my-3 [&_li]:gap-2.5 [&_svg]:text-[color:var(--ds-primary)] [&_svg]:shrink-0 [&_svg]:w-[18px]",
    "[&_svg]:h-[18px] [&_svg]:mt-px",
  ].join(' '),
} as const


function usePage(title: string) {
  useEffect(() => { const previousTitle = document.title; const previousLang = document.documentElement.lang; document.title = `${title} | SelfStorage`; document.documentElement.lang = 'en'; return () => { document.title = previousTitle; document.documentElement.lang = previousLang } }, [title])
}
function Breadcrumb({ children }: { children: ReactNode }) { return <nav className="ds-breadcrumb flex flex-wrap text-[length:12px] text-[color:var(--ds-muted)] px-0 py-7 gap-2.5 [&_a:hover]:underline max-[767px]:text-[length:11px] max-[767px]:px-0 max-[767px]:py-[22px]" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span>{children}</nav> }
function Intro({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) { return <div className="ds-intro pt-3 pb-9 max-w-[740px] px-0 [&>p]:text-[length:15px] [&>p]:leading-[1.85] [&>p]:text-[color:var(--ds-muted)] [&>p]:max-w-[620px] [.ds-split-hero_&]:p-10 max-[1100px]:[.ds-split-hero_&]:p-[30px] max-[767px]:[.ds-split-hero_&]:p-7 max-[767px]:pb-7"><span className="ds-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:#1d4ed8]">{eyebrow}</span><h1>{title}</h1><p>{children}</p></div> }
function SampleNote() { return <p className="ds-data-note text-[length:12px] text-[color:var(--ds-muted)] leading-[1.8] mx-0 my-[18px]">Information, images and prices are illustrative. Confirm actual location, rental terms and availability with the facility.</p> }
function ContactBanner() { return <section className="ds-contact-banner flex items-center justify-between bg-none bg-[color:#eaf1fb] bg-clip-border p-[34px] mx-0 my-[50px] gap-[30px] rounded-[18px] [&_h2]:mx-0 [&_h2]:my-2.5 [&_p]:text-[length:13px] [&_p]:text-[color:var(--ds-muted)] max-[767px]:flex-col max-[767px]:items-start max-[767px]:p-[26px] max-[767px]:mx-0 max-[767px]:my-9 max-[767px]:[&_h2]:text-[length:22px]"><div><span className="ds-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:#1d4ed8]">A LITTLE ADVICE. A BETTER FIT.</span><h2>Not sure which space fits?</h2><p>Tell us what you need to store and get advice before booking.</p></div><a className={`ds-button ${styles.dsButton}`} href="tel:+84909149563">Call 0909 149 563 <DiscoveryIcon name="arrow" /></a></section> }
function NotFound({ unit = false }: { unit?: boolean }) { return <div className={`ds-empty ${styles.dsEmpty}`}><h1>{unit ? 'Unit not found' : 'Facility not found'}</h1><p>This link may no longer be valid. Please choose a storage facility.</p><Link className={`ds-button ${styles.dsButton}`} to="/facilities">View facility</Link></div> }
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
function UnitCard({ unit }: { unit: StorageUnit }) { const [params] = useSearchParams(); const target = unit.available ? bookingPath(unit, params) : `/storage/${unit.id}`; return <article className={`ds-card ${styles.dsCard}`}><Link className={`ds-card-photo ${styles.dsCardPhoto}`} to={target}><img src={unit.image} alt={unit.name} loading="lazy" /><span className={`ds-badge ${styles.dsBadge} ${!unit.available ? 'muted' : ''}`}>{unit.available ? 'Available to select' : 'Not accepting bookings'}</span></Link><div className={`ds-card-body ${styles.dsCardBody}`}><span className="ds-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:#1d4ed8]">{unit.facility}</span><h3><Link to={target}>{unit.name}</Link></h3><div className={`ds-tags ${styles.dsTags}`}><span>{unit.area} m²</span><span>{unit.type === 'cold' ? 'Cold storage' : 'Standard storage'}</span></div><p>{unit.description}</p><div className={`ds-card-bottom ${styles.dsCardBottom}`}><div><strong>{money(unit.monthlyPrice)}</strong><small>/ month · sample price</small></div><Link className="ds-link [&_svg]:w-[17px] [&_svg]:h-[17px] inline-flex items-center text-[color:#1d4ed8] text-[length:13px] font-[650] min-h-11 gap-2 [.ds-sticky_&]:mt-2" to={target}>{unit.available ? 'Book this unit' : 'View details'} <DiscoveryIcon name="arrow" /></Link></div></div></article> }

export function FacilitiesPage() {
  usePage('Facilities')
  const [params, setParams] = useSearchParams()
  const district = params.get('location') || ''
  const size = params.get('size') || ''
  const filtered = facilities.filter(f => (!district || f.id === district) && (!size || storageUnits.some(u => u.location === f.id && u.size === size)))
  function filter(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }) }
  return <><Breadcrumb><span aria-current="page">Facilities</span></Breadcrumb><section className="ds-split-hero grid grid-cols-[1.1fr_1fr] bg-none bg-[color:#eaf1fb] bg-clip-border overflow-hidden mb-7 rounded-[22px] [&>img]:w-full [&>img]:h-full [&>img]:min-h-[310px] [&>img]:object-cover max-[767px]:grid-cols-[1fr] max-[767px]:[&>img]:h-[200px] max-[767px]:[&>img]:min-h-0"><Intro eyebrow="CLOSE TO YOU. RIGHT FOR YOU." title="Find more space. Close to home.">Explore facilities in Ho Chi Minh City and find a place for your belongings and your next chapter.</Intro><img src="/images/storage-hero.webp" alt="Storage corridor with blue unit doors" /></section><div className={`ds-filter-panel ${styles.dsFilterPanel}`}><label>Location<select value={district} onChange={e => filter('location', e.target.value)}><option value="">All locations</option>{facilities.map(f => <option key={f.id} value={f.id}>{f.district}</option>)}</select></label><label>Unit size<select value={size} onChange={e => filter('size', e.target.value)}><option value="">All sizes</option>{sizeGuide.map(s => <option key={s.size} value={s.size}>{sizeLabels[s.size]} · {s.area} m²</option>)}</select></label><button className={`ds-button secondary ${styles.dsButton}`} onClick={() => setParams({})}>Clear filters</button></div><div className={`ds-section-heading ${styles.dsSectionHeading}`}><div><h2>Storage facilities</h2><p role="status">{filtered.length} matching facilities</p></div><Link className="ds-link [&_svg]:w-[17px] [&_svg]:h-[17px] inline-flex items-center text-[color:#1d4ed8] text-[length:13px] font-[650] min-h-11 gap-2 [.ds-sticky_&]:mt-2" to="/pricing">Compare sizes <DiscoveryIcon name="arrow" /></Link></div><div className="ds-facility-grid grid grid-cols-2 gap-6 max-[767px]:grid-cols-[1fr]">{filtered.map(f => { const units = storageUnits.filter(u => u.location === f.id); return <article className={`ds-card ${styles.dsCard}`} key={f.id}><Link className={`ds-card-photo ${styles.dsCardPhoto}`} to={`/facilities/${f.id}`}><img src={f.image} alt={`Illustrative storage space at ${f.name}`} loading="lazy" /><span className={`ds-badge ${styles.dsBadge}`}>{f.district}</span></Link><div className={`ds-card-body ${styles.dsCardBody}`}><h2><Link to={`/facilities/${f.id}`}>{f.name}</Link></h2><p className="ds-icon-text flex items-center gap-2 [&_svg]:shrink-0 [&_svg]:w-[17px] [&_svg]:h-[17px]"><DiscoveryIcon name="pin" />{f.address}</p><p>{f.description}</p><div className={`ds-tags ${styles.dsTags}`}>{[...new Set(units.map(u => u.area))].map(a => <span key={a}>{a} m²</span>)}<span>{units.length} sample unit options</span></div><div className={`ds-card-bottom ${styles.dsCardBottom}`}><div><small>Sample prices from</small><strong>{money(startingPrice(f.id)!)}<small>/ month</small></strong></div><Link className={`ds-button secondary ${styles.dsButton}`} to={`/facilities/${f.id}`}>View facility <DiscoveryIcon name="arrow" /></Link></div></div></article> })}</div>{!filtered.length && <div className={`ds-empty ${styles.dsEmpty}`}><h2>No matching facilities</h2><p>Try changing the location or unit size.</p><button className={`ds-button ${styles.dsButton}`} onClick={() => setParams({})}>Clear filters</button></div>}<SampleNote /><ContactBanner /></>
}

export function FacilityDetailsPage() {
  const { facilityId } = useParams()
  const facility = facilities.find(f => f.id === facilityId)
  usePage(facility?.name || 'Facility not found')
  const [size, setSize] = useState('')
  const [available, setAvailable] = useState(false)
  if (!facility) return <NotFound />
  const all = storageUnits.filter(u => u.location === facility.id)
  const units = all.filter(u => (!size || u.size === size) && (!available || u.available))
  return <><Breadcrumb><Link to="/facilities">Facilities</Link><span aria-hidden="true">/</span><span aria-current="page">{facility.district}</span></Breadcrumb><div className={`ds-section-heading ${styles.dsSectionHeading}`}><div><span className="ds-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:#1d4ed8]">SPACE FOR YOUR NEXT CHAPTER</span><h1>{facility.name}</h1><p className="ds-icon-text flex items-center gap-2 [&_svg]:shrink-0 [&_svg]:w-[17px] [&_svg]:h-[17px]"><DiscoveryIcon name="pin" />{facility.address}</p></div><a className={`ds-button secondary ${styles.dsButton}`} href="tel:+84909149563">Contact facility</a></div><img className="ds-cover w-full h-[360px] object-cover mb-[30px] rounded-[18px] max-[767px]:h-[240px]" src={facility.image} alt={`Illustrative facility image ${facility.district}`} /><div className="ds-detail-content max-w-[1000px] mx-auto my-0"><div><section className={`ds-panel ${styles.dsPanel}`}><h2>A place for your belongings</h2><p>{facility.description}</p><div className={`ds-feature-grid ${styles.dsFeatureGrid}`}><div><DiscoveryIcon name="box" /><h3>A choice of sizes</h3><p>{[...new Set(all.map(u => u.area))].join(' / ')} m² sample sizes.</p></div><div><DiscoveryIcon name="calendar" /><h3>Flexible rental periods</h3><p>Choose a rental of 1, 3, 6, 12 or 24 months.</p></div><div><DiscoveryIcon name="help" /><h3>Here to help</h3><p>Discuss storage conditions and handover.</p></div></div></section><section className={`ds-panel ${styles.dsPanel}`}><h2>Before you visit</h2><dl className={`ds-specs ${styles.dsSpecs}`}><div><dt>Location</dt><dd>{facility.address}</dd></div><div><dt>Full address</dt><dd>Contact us to confirm</dd></div><div><dt>Access hours</dt><dd>Confirm with the facility before visiting</dd></div><div><dt>Handover & moving</dt><dd>Discuss your schedule and support needs</dd></div></dl></section></div></div><section id="facility-units" className="ds-section [scroll-margin-top:110px] mx-0 my-11"><div className={`ds-section-heading ${styles.dsSectionHeading}`}><div><h2>Units in {facility.district}</h2><p role="status">{units.length} matching options</p></div></div><div className={`ds-filter-panel compact ${styles.dsFilterPanel}`}><label>Size<select value={size} onChange={e => setSize(e.target.value)}><option value="">All sizes</option>{sizeGuide.map(s => <option key={s.size} value={s.size}>{s.area} m²</option>)}</select></label><label className="ds-checkbox [.discovery-site_&]:flex [.discovery-site_&]:items-center [.discovery-site_&]:min-h-11 [.discovery-site_&]:gap-2.5 [&_input]:w-[17px] [&_input]:h-[17px] [&_input]:[accent-color:var(--ds-primary)]"><input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} />Available preview units only</label></div><div className="ds-unit-grid grid grid-cols-3 gap-6 max-[1100px]:gap-4 max-[767px]:grid-cols-2 max-[480px]:grid-cols-[1fr]">{units.map(u => <UnitCard key={u.id} unit={u} />)}</div>{!units.length && <div className={`ds-empty ${styles.dsEmpty}`}><h3>No units match your filters</h3><button className={`ds-button secondary ${styles.dsButton}`} onClick={() => { setSize(''); setAvailable(false) }}>Clear filters</button></div>}</section><ContactBanner /></>
}

export function StorageUnitDetailsPage() {
  const { unitId } = useParams()
  const unit = storageUnits.find(u => u.id === unitId)
  usePage(unit?.name || 'Unit not found')
  if (!unit) return <NotFound unit />
  const guide = sizeGuide.find(s => s.size === unit.size)!
  return <><Breadcrumb><Link to="/facilities">Facility</Link><span aria-hidden="true">/</span><Link to={`/facilities/${unit.location}`}>{unit.facility}</Link><span aria-hidden="true">/</span><span aria-current="page">{unit.name}</span></Breadcrumb><div className={`ds-section-heading ${styles.dsSectionHeading}`}><div><span className="ds-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:#1d4ed8]">A SPACE OF YOUR OWN</span><h1>{unit.name}</h1><p>{unit.facility} · {unit.area} m² · {unit.type === 'cold' ? 'Cold storage' : 'Standard storage'}</p></div><span className={`ds-status [&.muted]:bg-none [&.muted]:bg-[color:#f1f5f9] [&.muted]:bg-clip-border [&.muted]:text-[color:#475569] bg-none bg-[color:#eaf7ef] bg-clip-border text-[color:#166534] text-[length:11px] font-semibold px-3 py-2 rounded-[20px] ${!unit.available ? 'muted' : ''}`}>{unit.available ? 'Available in the preview catalog' : 'Not accepting bookings'}</span></div><div className="ds-detail-content max-w-[1000px] mx-auto my-0"><div><img className="ds-unit-cover w-full h-[390px] object-cover mb-6 rounded-[18px] max-[767px]:h-[280px] [.ds-detail-content_&]:h-[440px] max-[767px]:[.ds-detail-content_&]:h-[280px]" src={unit.image} alt={`Illustrative image ${unit.name}`} /><section className={`ds-panel ${styles.dsPanel}`}><h2>Is this space right for you?</h2><p>{unit.description}</p><div className={`ds-tags ${styles.dsTags}`}><span>{unit.area} m² sample floor area</span><span>{sizeLabels[unit.size]}</span><span>{unit.type === 'cold' ? 'Confirm temperature requirements' : 'General storage'}</span></div><h3 className="ds-subheading mt-6 mb-4 mx-0">Suggested items</h3><ul className={`ds-check-list ${styles.dsCheckList}`}>{guide.items.map(i => <li key={i}><DiscoveryIcon name="check" />{i}</li>)}</ul><p className="ds-data-note text-[length:12px] text-[color:var(--ds-muted)] leading-[1.8] mx-0 my-[18px]">Capacity depends on item sizes and packing. Confirm unit dimensions and storage conditions with the facility.</p><Link className="ds-link [&_svg]:w-[17px] [&_svg]:h-[17px] inline-flex items-center text-[color:#1d4ed8] text-[length:13px] font-[650] min-h-11 gap-2 [.ds-sticky_&]:mt-2" to="/pricing">Compare other sizes <DiscoveryIcon name="arrow" /></Link></section><section className={`ds-panel ${styles.dsPanel}`}><h2>Using your storage unit</h2><ul className={`ds-check-list ${styles.dsCheckList}`}><li><DiscoveryIcon name="check" />Measure large items and list your belongings.</li><li><DiscoveryIcon name="check" />Discuss access hours, moving and handover.</li><li><DiscoveryIcon name="check" />Confirm rental terms, deposits and fees.</li></ul><Link className="ds-link [&_svg]:w-[17px] [&_svg]:h-[17px] inline-flex items-center text-[color:#1d4ed8] text-[length:13px] font-[650] min-h-11 gap-2 [.ds-sticky_&]:mt-2" to="/how-it-works">View the process & FAQs</Link></section></div></div><section className="ds-section [scroll-margin-top:110px] mx-0 my-11"><div className={`ds-section-heading ${styles.dsSectionHeading}`}><h2>More units at this facility</h2></div><div className="ds-unit-grid grid grid-cols-3 gap-6 max-[1100px]:gap-4 max-[767px]:grid-cols-2 max-[480px]:grid-cols-[1fr]">{storageUnits.filter(u => u.location === unit.location && u.id !== unit.id).slice(0, 3).map(u => <UnitCard key={u.id} unit={u} />)}</div></section><ContactBanner /></>
}

export function PricingSizeGuidePage() {
  usePage('Pricing & Size Guide')
  const [selectedUnits, setSelectedUnits] = useState<Partial<Record<StorageSize, string>>>({})
  const availableUnits = (size: StorageSize) => storageUnits.filter(unit => unit.available && unit.size === size).sort((a, b) => a.monthlyPrice - b.monthlyPrice)
  const selectedUnit = (size: StorageSize) => availableUnits(size).find(unit => unit.id === selectedUnits[size]) || availableUnits(size)[0]
  const formatCost = (amount?: number) => amount === undefined ? 'Unavailable' : money(amount)
  return <><Breadcrumb><span aria-current="page">Pricing & Size Guide</span></Breadcrumb><Intro eyebrow="THE RIGHT SIZE. CLEAR COSTS." title="A size for every need.">From a few boxes to a whole home. Compare sizes and plan your budget before choosing your space.</Intro><div className="ds-unit-grid grid grid-cols-3 gap-6 max-[1100px]:gap-4 max-[767px]:grid-cols-2 max-[480px]:grid-cols-[1fr]">{sizeGuide.map(s => { const units = availableUnits(s.size); const unit = selectedUnit(s.size); return <article className="ds-card ds-size-card bg-none bg-[color:white] bg-clip-border overflow-hidden [box-shadow:0_3px_16px_#14263d04] [transition:border-color_.2s] rounded-[16px] border border-solid border-[color:var(--ds-line)] [&:hover]:border-[color:#a0b6d7] [&>img]:w-full [&>img]:h-[190px] [&>img]:object-cover [&_h2]:text-[length:46px] [&_h2]:mx-0 [&_h2]:my-3 [&_h2_small]:text-[length:20px] [&_h2_small]:text-[color:var(--ds-muted)] [&_h3]:text-[length:18px] [.discovery-site_&_h3]:text-[length:18px]" key={s.size}><img src={s.image} alt={`Illustrative storage unit ${s.area} square metres`} /><div className={`ds-card-body ${styles.dsCardBody}`}><span className="ds-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:#1d4ed8]">{sizeLabels[s.size]}</span><h2>{s.area} <small>m²</small></h2><h3>{s.title}</h3><p>{s.use}</p><ul className={`ds-check-list ${styles.dsCheckList}`}>{s.items.map(i => <li key={i}><DiscoveryIcon name="check" />{i}</li>)}</ul><div className="ds-size-price [border-top-width:1px] [border-top-style:solid] [border-top-color:var(--ds-line)] mt-[22px] px-0 py-5 [&_small]:block [&_small]:text-[color:var(--ds-muted)] [&_small]:text-[length:11px] [&_strong]:text-[length:24px]"><small>Monthly rent</small><strong>{formatCost(unit?.monthlyPrice)}</strong><small>/ month</small></div><label className="mt-5 mb-4 block text-xs font-semibold text-slate-700" htmlFor={`pricing-unit-${s.size}`}>Location & unit
  <select id={`pricing-unit-${s.size}`} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500" value={unit?.id || ''} disabled={!units.length} onChange={event => setSelectedUnits(current => ({ ...current, [s.size]: event.target.value }))}>
    {units.length ? units.map(option => <option key={option.id} value={option.id}>{option.facility} · {option.name}</option>) : <option value="">No available units</option>}
  </select>
</label>{unit ? <Link className={`ds-button secondary ${styles.dsButton}`} to={bookingPath(unit)}>Book {s.area} m² <DiscoveryIcon name="arrow" /></Link> : <button className="ds-button min-h-11 w-full cursor-not-allowed rounded-lg bg-slate-200 px-4 py-3 text-sm text-slate-500" disabled>No available units</button>}</div></article>})}</div><SampleNote /><section className="ds-section [scroll-margin-top:110px] mx-0 my-11"><div className={`ds-section-heading ${styles.dsSectionHeading}`}><h2>Find the right size</h2></div><div className={`ds-feature-grid ${styles.dsFeatureGrid}`}><div className={`ds-panel ${styles.dsPanel}`}><DiscoveryIcon name="ruler" /><h3>Measure before choosing</h3><p>Measure large items and check whether furniture can be disassembled.</p></div><div className={`ds-panel ${styles.dsPanel}`}><DiscoveryIcon name="box" /><h3>Leave room for access</h3><p>Keep frequently used items near the front and leave room to move.</p></div><div className={`ds-panel ${styles.dsPanel}`}><DiscoveryIcon name="help" /><h3>Ask the facility</h3><p>Share your item list for advice on capacity and storage conditions.</p></div></div></section><ContactBanner /></>
}

export function HowItWorksPage() {
  usePage('How It Works / FAQ')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const filtered = faqItems.filter(f => (category === 'all' || f.category === category) && `${f.question} ${f.answer}`.toLocaleLowerCase('en').includes(search.trim().toLocaleLowerCase('en')))
  return <><Breadcrumb><span aria-current="page">How It Works / FAQ</span></Breadcrumb><Intro eyebrow="FROM SEARCH TO SETTLED" title="Start simply. Store with confidence.">Understand each step and what to confirm as you prepare for your new space.</Intro><ol className="ds-process grid grid-cols-3 list-none mt-3 mb-11 p-0 mx-0 gap-6 [&_h2]:text-[length:21px] [&_p]:min-h-[84px] max-[767px]:grid-cols-[1fr] max-[767px]:gap-4 max-[767px]:[&_p]:min-h-0">{[{ icon: 'pin', title: 'Find your space', text: 'Explore facilities, compare sizes and review unit details.', to: '/facilities', cta: 'Explore facilities' }, { icon: 'calendar', title: 'Plan your rental', text: 'Choose your rental period, enter your details and review estimated costs.', to: '/booking', cta: 'Start booking' }, { icon: 'box', title: 'Confirm & move in', text: 'For a real rental, agree on the contract and handover schedule with the facility before bringing your belongings.', to: '/how-it-works#checklist', cta: 'View preparation checklist' }].map((s, i) => <li className={`ds-panel ${styles.dsPanel}`} key={s.title}><div className="ds-process-top flex items-center justify-between text-[color:#62748c] mb-6 text-[length:26px] font-bold max-[767px]:mb-[18px]"><span className="ds-icon-tile grid place-items-center bg-none bg-[color:#edf3fc] bg-clip-border text-[color:var(--ds-primary)] w-12 h-12 rounded-[12px]"><DiscoveryIcon name={s.icon} /></span><span>0{i + 1}</span></div><h2>{s.title}</h2><p>{s.text}</p><Link className="ds-link [&_svg]:w-[17px] [&_svg]:h-[17px] inline-flex items-center text-[color:#1d4ed8] text-[length:13px] font-[650] min-h-11 gap-2 [.ds-sticky_&]:mt-2" to={s.to}>{s.cta} <DiscoveryIcon name="arrow" /></Link></li>)}</ol><section id="checklist" className="ds-section ds-checklist [scroll-margin-top:110px] grid grid-cols-[1fr_1fr] bg-none bg-[color:#eaf1fb] bg-clip-border p-9 mx-0 my-11 gap-10 rounded-[18px] [&_h2]:text-[length:29px] [&_h2]:mx-0 [&_h2]:my-3 [&_p]:text-[color:var(--ds-muted)] [&_p]:text-[length:13px] max-[767px]:grid-cols-[1fr] max-[767px]:p-6 max-[767px]:gap-5"><div><span className="ds-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:#1d4ed8]">READY FOR MOVING DAY</span><h2>A little preparation,<br />a smoother moving day.</h2><p>Contact the facility to confirm your handover requirements.</p></div><ul className={`ds-check-list ${styles.dsCheckList}`}><li><DiscoveryIcon name="check" />List your items and measure large belongings.</li><li><DiscoveryIcon name="check" />Pack, label and protect fragile items.</li><li><DiscoveryIcon name="check" />Check rental terms, deposit and end date.</li><li><DiscoveryIcon name="check" />Confirm the address, access hours and moving schedule.</li></ul></section><section className="ds-section [scroll-margin-top:110px] mx-0 my-11" id="faq"><div className={`ds-section-heading ${styles.dsSectionHeading}`}><div><span className="ds-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:#1d4ed8]">ANSWERS BEFORE YOU BEGIN</span><h2>Frequently asked questions</h2></div></div><div className="ds-faq-tools flex justify-between items-center flex-wrap gap-5 [&>label]:flex-1 [&>label]:min-w-[240px] [&_input]:!mt-0 max-[767px]:[&>label]:min-w-0 max-[767px]:[&>label]:[flex-basis:100%]"><label><span className="ds-sr-only absolute w-px h-px overflow-hidden [clip-path:inset(50%)]">Search questions</span><input type="search" placeholder="Search booking, pricing, access…" value={search} onChange={e => setSearch(e.target.value)} /></label><div className="ds-filter-chips flex flex-wrap gap-2 [&_button]:min-h-11 [&_button]:bg-none [&_button]:bg-[color:white] [&_button]:bg-clip-border [&_button]:text-[length:12px] [&_button]:cursor-pointer [&_button]:px-3.5 [&_button]:py-[9px] [&_button]:rounded-[8px] [&_button]:border [&_button]:border-solid [&_button]:border-[color:var(--ds-line)] [&_[aria-pressed=true]]:bg-none [&_[aria-pressed=true]]:bg-[color:#1d4ed8] [&_[aria-pressed=true]]:bg-clip-border [&_[aria-pressed=true]]:text-[color:white] [&_[aria-pressed=true]]:border-[color:#1d4ed8]" role="group" aria-label="FAQ topics">{[{ id: 'all', name: 'All' }, { id: 'booking', name: 'Book Storage' }, { id: 'sizes', name: 'Size' }, { id: 'pricing', name: 'Pricing' }, { id: 'access', name: 'Using storage' }].map(c => <button key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.name}</button>)}</div></div><p className="ds-data-note text-[length:12px] text-[color:var(--ds-muted)] leading-[1.8] mx-0 my-[18px]" role="status">{filtered.length} matching questions</p><div className="ds-faq-list bg-none bg-[color:white] bg-clip-border overflow-hidden rounded-[16px] border border-solid border-[color:var(--ds-line)] [&_details+details]:[border-top-width:1px] [&_details+details]:[border-top-style:solid] [&_details+details]:[border-top-color:var(--ds-line)] [&_summary]:flex [&_summary]:justify-between [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:font-semibold [&_summary]:text-[length:14px] [&_summary]:px-6 [&_summary]:py-[22px] [&_summary]:gap-4 [&_summary::-webkit-details-marker]:hidden [&_summary_span]:text-[length:22px] [&_summary_span]:text-[color:var(--ds-primary)] [&_summary_span]:leading-[1] [&_details[open]_summary_span]:[transform:rotate(45deg)] [&_details[open]]:bg-none [&_details[open]]:bg-[color:#f5f9ff] [&_details[open]]:bg-clip-border [&_details_p]:text-[length:13px] [&_details_p]:text-[color:var(--ds-muted)] [&_details_p]:leading-[1.9] [&_details_p]:pt-0 [&_details_p]:pb-6 [&_details_p]:max-w-[900px] [&_details_p]:px-6 max-[767px]:[&_summary]:text-[length:13px] max-[767px]:[&_summary]:p-[18px] max-[767px]:[&_details_p]:pt-0 max-[767px]:[&_details_p]:pb-5 max-[767px]:[&_details_p]:px-[18px]">{filtered.map(f => <details key={f.question}><summary>{f.question}<span aria-hidden="true">+</span></summary><p>{f.answer}</p></details>)}</div>{!filtered.length && <div className={`ds-empty ${styles.dsEmpty}`}><h3>No questions found</h3><p>Try another keyword or contact our support team.</p><button className={`ds-button secondary ${styles.dsButton}`} onClick={() => { setSearch(''); setCategory('all') }}>Clear search</button></div>}</section><ContactBanner /></>
}
