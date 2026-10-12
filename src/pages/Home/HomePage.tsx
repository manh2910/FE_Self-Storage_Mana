import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROLE_HOME } from '../../routes/roleRoutes'
import './HomePage.css'

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    arrow: 'M4 12h16M14 6l6 6-6 6', pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    box: 'm12 3 9 5v9l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5M12 13v9M7.5 5.5l9 5',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z m-4 9 3 3 5-6',
    calendar: 'M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2',
    search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0m-2 5 6 6', check: 'm5 12 4 4L19 6',
    headset: 'M4 17v-6a8 8 0 0 1 16 0v6M4 12h3v6H4M20 12h-3v6h3v2l-5 1',
    key: 'M13 8A5 5 0 1 1 3 8a5 5 0 0 1 10 0m-1 4 9 9m-5-5 3-3m-1 5 3-3',
    globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3c-6 5-6 13 0 18 6-5 6-13 0-18',
    menu: 'M4 6h16M4 12h16M4 18h16', plus: 'M5 12h14M12 5v14',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.box} /></svg>
}
const photo = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const sizes = [
  { name: 'Small', area: '5 m²', capacity: 'Boxes, seasonal items & personal belongings', description: 'A little space. A big difference.', image: '/images/storage-small.webp', fit: 'Personal belongings', size: 'small' },
  { name: 'Medium', area: '10 m²', capacity: 'Furniture & a small apartment’s contents', description: 'Room for your next chapter.', image: '/images/storage-medium.webp', fit: 'Home & furniture', size: 'medium' },
  { name: 'Large', area: '20 m²', capacity: 'Large furniture, equipment & inventory', description: 'Space to think bigger.', image: photo('photo-1586528116311-ad8dd3c8310d'), fit: 'Business & beyond', size: 'large' },
]
const facilities = [
  { name: 'District 1', district: 'district-1', address: 'Central Ho Chi Minh City', image: '/images/storage-hero.webp', sizes: ['small', 'medium'] },
  { name: 'Thu Duc', district: 'thu-duc', address: 'Thu Duc, Ho Chi Minh City', image: '/images/storage-hero.webp', sizes: ['medium', 'large'] },
  { name: 'Business', district: 'thu-duc', address: 'Ho Chi Minh City', image: photo('photo-1586528116311-ad8dd3c8310d'), sizes: ['small', 'medium', 'large'] },
]
const faqs = [
  ['How do I book a storage unit?', 'Create an account or sign in, then open Find Storage in your customer portal. Online booking is currently being developed; contact our team to discuss your storage needs.'],
  ['Can I choose my rental duration?', 'Your rental period is confirmed in your rental agreement. Contact the facility team to discuss the duration that suits your needs.'],
  ['How can I access my storage unit?', 'The facility team provides access instructions during check-in and handover. Confirm access hours and requirements with your selected facility.'],
  ['Can I extend my rental?', 'Contact the facility team before your agreement ends to discuss an extension, availability, and any updated rental charges.'],
  ['What happens when my rental expires?', 'Review the end date and move-out terms in your agreement. Contact support ahead of time to arrange move-out or discuss renewal.'],
  ['How do I request on-site support?', 'Call 0909 149 563 or use the support area in your customer portal. The team will help you coordinate with your facility.'],
]
export default function HomePage() {
  useEffect(() => {
    const previousLanguage = document.documentElement.lang
    const previousTitle = document.title
    document.documentElement.lang = 'en'
    document.title = 'SelfStorage — Your Space, Your Way'
    return () => { document.documentElement.lang = previousLanguage; document.title = previousTitle }
  }, [])
  const { isAuthenticated, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [location, setLocation] = useState('')
  const [size, setSize] = useState('')
  const [date, setDate] = useState('')
  const [search, setSearch] = useState<{ location: string; size: string; date: string } | null>(null)
  const [selected, setSelected] = useState<typeof facilities[number] | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!selected) return
    const previousFocus = document.activeElement as HTMLElement | null
    dialogRef.current?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus() }
  }, [selected])
  const dashboardPath = user ? ROLE_HOME[user.role] : null
  const browsePath = user?.role === 'StorageCustomer' ? '/customer/browse' : isAuthenticated && dashboardPath ? dashboardPath : '/register'
  const today = new Date()
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const results = facilities.filter(f => (!search?.location || f.district === search.location) && (!search?.size || f.sizes.includes(search.size)))
  function submitSearch(event: FormEvent) { event.preventDefault(); setSearch({ location, size, date }); document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' }) }
  function explore(value: string) { setSize(value); setLocation(''); setSearch({ location: '', size: value, date }); document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' }) }
  function clearFilters() { setSearch(null); setLocation(''); setSize(''); setDate('') }
  const brand = <><span className="brand-icon"><Icon name="box" size={25} /></span>Self<span>Storage</span><span className="brand-dot">.</span></>
  return (
    <div className="storage-home">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header"><div className="home-container header-inner">
        <Link to="/" className="brand">{brand}</Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation" onClick={() => setMenuOpen(false)}><a href="#main" className="active">Home</a><a href="#search">Find Storage</a><a href="#how-it-works">How It Works</a><a href="#locations">Locations</a><a href="#about">About Us</a><a href="#contact">Contact</a>{!isAuthenticated && <Link className="mobile-sign-up" to="/register">Sign Up</Link>}</nav>
        <div className="header-actions"><label className="language"><Icon name="globe" size={16} /><select aria-label="Language" defaultValue="en"><option value="en">EN</option><option value="vi" disabled>VI · Coming soon</option></select></label>{isAuthenticated && user ? <><Link className="sign-in" to={dashboardPath || '/'}>{user.fullName}</Link><button className="sign-in" onClick={logout}>Sign out</button></> : <><Link className="sign-in" to="/login">Sign In</Link><Link className="sign-up" to="/register">Sign Up</Link></>}<a className="button primary header-cta" href="#search">Find Storage <Icon name="arrow" size={16} /></a><button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name="menu" /></button></div>
      </div></header>
      <main id="main">
        <section className="hero home-container"><div className="hero-copy"><span className="eyebrow"><span className="status-dot" /> MORE SPACE. LESS STRESS.</span><h1>Your Space,<br /><span>Your Way.</span></h1><p>Discover secure, flexible, and affordable storage solutions designed around your needs. Find the perfect space and book online in minutes.</p><div className="hero-buttons"><a className="button primary" href="#search">Find Your Storage <Icon name="arrow" size={18} /></a><a className="button secondary" href="#how-it-works">How It Works <span className="play-icon">▷</span></a></div><div className="hero-benefits"><span><Icon name="check" size={15} /> Flexible rental options</span><span><Icon name="check" size={15} /> Clear rental agreements</span></div></div>
          <div className="hero-visual"><img className="hero-image" src="/images/storage-hero.webp" alt="Bright modern storage corridor with blue roll-up unit doors" fetchPriority="high" /><div className="image-label"><Icon name="pin" size={15} /> A better place for your belongings</div><div className="floating-badge secure"><span className="icon-tile"><Icon name="shield" size={22} /></span><div><strong>Secure Storage</strong><small>Peace of mind, built in.</small></div></div><div className="floating-badge flexible"><span className="icon-tile"><Icon name="calendar" /></span><div><strong>Flexible Rental</strong><small>A little while. Or a little longer.</small></div></div><div className="availability-preview"><span className="status-dot" /><span>Small, medium & large spaces</span><Icon name="arrow" size={16} /></div></div>
        </section>
        <div className="home-container search-wrap" id="search"><form className="storage-search" onSubmit={submitSearch}><label><span><Icon name="pin" size={17} /> Select Location</span><select value={location} onChange={e => setLocation(e.target.value)}><option value="">All locations · Ho Chi Minh City</option><option value="district-1">District 1</option><option value="thu-duc">Thu Duc</option></select></label><label><span><Icon name="box" size={17} /> Storage Size</span><select value={size} onChange={e => setSize(e.target.value)}><option value="">Choose your size</option>{sizes.map(s => <option key={s.size} value={s.size}>{s.name} · {s.area}</option>)}</select></label><label><span><Icon name="calendar" size={17} /> Start Date</span><input aria-label="Start date" type="date" min={minDate} value={date} onChange={e => setDate(e.target.value)} /></label><button className="button primary" type="submit"><Icon name="search" size={19} /> Search Storage</button></form><p className="search-note">Explore sample spaces below. Confirm prices and availability with our team.</p></div>
        <div className="home-container reassurance"><span><Icon name="shield" /> Secure facilities</span><span><Icon name="calendar" /> Flexible rental plans</span><span><Icon name="box" /> Space for every need</span><span><Icon name="headset" /> Support when you need it</span></div>
        <section className="section home-container" id="units"><div className="section-heading centered"><span className="eyebrow">A SPACE THAT FITS YOUR LIFE</span><h2>Find the Perfect Space for Your Needs</h2><p>From a few personal belongings to large business inventories,<br className="desktop-break" /> we have storage solutions for every requirement.</p></div><div className="size-grid">{sizes.map((s, i) => <article className="size-card" key={s.size}><div className="card-photo"><img src={s.image} alt={`${s.name} storage space for ${s.fit.toLowerCase()}`} loading="lazy" /><span className="photo-tag">{s.fit}</span></div><div className="size-content"><div className="card-title"><h3>{s.name} Storage</h3><span className="area">{s.area}</span></div><p>{s.description}</p><div className="capacity"><Icon name="box" size={17} /><span>{s.capacity}</span></div><button className="text-link" onClick={() => explore(s.size)}>Explore Units <Icon name="arrow" size={18} /></button></div><span className="card-index">0{i + 1}</span></article>)}</div><p className="section-note">Illustrative imagery. Unit dimensions and suitability are confirmed by the facility.</p></section>
        <section className="locations-section section" id="locations"><div className="home-container"><div className="section-heading split"><div><span className="eyebrow">CLOSER THAN YOU THINK</span><h2>Explore Storage Near You</h2><p>A little more room, right where you need it.</p></div><button className="text-link" onClick={clearFilters}>View all locations <Icon name="arrow" size={18} /></button></div><div className="preview-notice" role="status">{search ? `${results.length} sample locations match your filters${search.date ? ` · Preferred start: ${search.date}` : ''}. ` : ''}Location previews — live prices and availability are not connected yet.</div>{results.length ? <div className="facility-grid">{results.map(f => <article className="facility-card" key={f.name}><div className="card-photo"><img src={f.image} alt={`${f.name} illustrative facility photograph`} loading="lazy" /><span className="photo-tag">Location preview</span></div><div className="facility-content"><h3>{f.name} Storage</h3><p className="address"><Icon name="pin" size={16} />{f.address}</p><div className="size-chips">{f.sizes.map(s => <span key={s}>{s}</span>)}</div><div className="facility-bottom"><div><small>Rental pricing</small><strong>Contact for a quote</strong></div><button aria-label={`View ${f.name} details`} onClick={() => setSelected(f)} className="button secondary">View Details <Icon name="arrow" size={16} /></button></div></div></article>)}</div> : <div className="empty-state"><Icon name="search" size={30} /><h3>No sample locations match this combination.</h3><p>Try a different size or browse all location previews.</p><button className="button secondary" onClick={clearFilters}>Clear filters</button></div>}</div></section>
        <section className="section home-container" id="features"><div className="section-heading centered"><span className="eyebrow">LESS TO WORRY ABOUT</span><h2>Storage Made Simple, Secure, and Flexible</h2><p>Thoughtful storage. From your first question to your last box.</p></div><div className="feature-grid">{[['shield', 'Secure Facilities', 'Access instructions and a clear handover process help you store with confidence.'], ['calendar', 'Flexible Rental Plans', 'Discuss a period that fits your plans, with terms set out in your agreement.'], ['box', 'Easy Online Booking', 'One customer portal for your storage journey. Online booking is coming soon.'], ['headset', 'Dedicated Customer Support', 'A real team to help with your questions, check-in, and on-site requests.']].map(([icon, title, desc]) => <div className="feature" key={title}><span className="icon-tile"><Icon name={icon} size={24} /></span><h3>{title}</h3><p>{desc}</p></div>)}</div></section>
        <section className="steps-section section" id="how-it-works"><div className="home-container"><div className="section-heading centered"><span className="eyebrow">FROM SEARCH TO SETTLED</span><h2>Your Storage in 3 Simple Steps</h2><p>More room in your life. Less on your to-do list.</p></div><div className="steps-grid">{[['search', 'Find Your Space', 'Explore storage by location and size. Ask our team to confirm the right fit.'], ['calendar', 'Book Online', 'Choose your rental period, review your agreement, and complete booking when available.'], ['key', 'Move In', 'Receive confirmation and follow your facility’s instructions to access your storage.']].map(([icon, title, desc], i) => <div className="step" key={title}><div className="step-icon"><Icon name={icon} size={27} /><span>{i + 1}</span></div><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>
        <section className="section home-container editorial" id="about"><div className="editorial-image"><img src="/images/storage-medium.webp" alt="Furniture and moving boxes neatly arranged in a clean storage unit" loading="lazy" /><span className="editorial-caption">A little space can change a lot.</span></div><div className="editorial-copy"><span className="eyebrow">ROOM FOR WHAT’S NEXT</span><h2>Life changes.<br />Your space can, too.</h2><p>A new home. A growing business. A fresh start. Whatever comes next, give your belongings a place of their own.</p><ul><li><Icon name="check" /> Keep the things that matter</li><li><Icon name="check" /> Make moving a little easier</li><li><Icon name="check" /> Give your business room to grow</li></ul><a className="button primary" href="#units">Find Your Fit <Icon name="arrow" size={18} /></a></div></section>
        <section className="home-container business-showcase"><div><span className="eyebrow">BIG IDEAS NEED A LITTLE ROOM</span><h2>Less clutter.<br />More possibility.</h2><p>From neatly packed personal belongings to business inventory, explore a space that works as hard as you do.</p><a className="text-link" href="#search">Explore business storage <Icon name="arrow" /></a></div><img src={photo('photo-1586528116311-ad8dd3c8310d', 1400)} alt="Organized warehouse shelves with boxed business inventory" loading="lazy" /></section>
        <section className="home-container trust-strip"><div><Icon name="shield" size={28} /><h3>Confidence at every step.</h3></div><p>Clear rental terms. A choice of spaces. A team you can reach.<br />Get the details you need before making your decision.</p><a href="#contact" className="text-link">Talk to our team <Icon name="arrow" size={18} /></a></section>
        <section className="section home-container faq-section"><div className="section-heading"><span className="eyebrow">GOOD QUESTIONS. CLEAR ANSWERS.</span><h2>A little clarity,<br />before you move in.</h2><p>Everything starts with feeling informed.</p><a href="#contact" className="text-link">Still have a question? Get in touch <Icon name="arrow" size={17} /></a></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus" size={18} /></summary><p>{answer}</p></details>)}</div></section>
        <section className="home-container final-cta"><span className="eyebrow">MAKE ROOM FOR YOUR NEXT CHAPTER</span><h2>Ready to Make More Room<br />for What Matters?</h2><p>Find the right storage space and start your rental journey today.</p><a className="button" href="#search">Explore Available Storage <Icon name="arrow" size={18} /></a><Icon name="box" size={240} /></section>
      </main>
      <footer id="contact"><div className="home-container footer-grid"><div className="footer-brand"><Link to="/" className="brand">{brand}</Link><p>Space for your belongings.<br />Room for your life.</p><span>Self-Storage Facility Rental</span></div><div><h3>Quick Links</h3><a href="#main">Home</a><a href="#about">About Us</a><a href="#locations">Locations</a><a href="#how-it-works">How It Works</a></div><div><h3>Storage Services</h3>{sizes.map(s => <button key={s.size} onClick={() => explore(s.size)}>{s.name} Storage</button>)}<Link to={browsePath}>Customer Portal</Link></div><div><h3>Customer Support</h3><a href="#features">Our Services</a><Link to={user?.role === 'StorageCustomer' ? '/customer/support' : '/login'}>Request Support</Link><details><summary>Privacy Policy</summary><p>Contact support for the full privacy policy before submitting personal information.</p></details><details><summary>Terms of Service</summary><p>Rental conditions are governed by your agreement. Request the full terms from the facility team.</p></details></div><div><h3>Let’s Talk</h3><a href="tel:+84909149563">0909 149 563</a><a href="mailto:support@selfstorage.local">support@selfstorage.local</a><span>Ho Chi Minh City, Vietnam</span><small>Email retained from the existing site.</small></div></div><div className="home-container footer-bottom"><span>© {new Date().getFullYear()} SelfStorage. All rights reserved.</span><span>More space. More possibilities.</span></div></footer>
      {selected && <dialog ref={dialogRef} onCancel={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) setSelected(null) }} className="facility-dialog" aria-labelledby="facility-title" onKeyDown={e => { if (e.key === 'Escape') setSelected(null) }}><button className="dialog-close" autoFocus aria-label="Close facility details" onClick={() => setSelected(null)}>×</button><span className="eyebrow">ILLUSTRATIVE LOCATION PREVIEW</span><h2 id="facility-title">{selected.name} Storage</h2><p>{selected.address}</p><p>Sample sizes: {selected.sizes.join(', ')}. These previews are not live inventory. Our team can confirm actual facilities, unit specifications, pricing and availability.</p>{search?.date && <p>Preferred start date: {search.date}</p>}<div className="hero-buttons"><a href="tel:+84909149563" className="button primary">Contact Our Team</a><Link className="button secondary" to={browsePath}>Open Portal <Icon name="arrow" size={16} /></Link></div></dialog>}
    </div>
  )
}


