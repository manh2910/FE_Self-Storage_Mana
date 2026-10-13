import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import './discovery.css'

export function DiscoveryIcon({ name = 'box' }: { name?: string }) {
  const paths: Record<string, string> = { box: 'm12 3 9 5v9l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5M12 13v9', pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0', arrow: 'M4 12h16m-6-6 6 6-6 6', menu: 'M4 6h16M4 12h16M4 18h16', calendar: 'M7 3v4M17 3v4M3 10h18M5 5h14v16H5Z', check: 'm5 12 4 4L19 6', help: 'M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0', ruler: 'm3 16 13-13 5 5-13 13-5-5Zm5-5 3 3m1-7 3 3' }
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.box} /></svg>
}
const links = [{ to: '/facilities', label: 'Facilities' }, { to: '/pricing', label: 'Pricing & Size Guide' }, { to: '/how-it-works', label: 'How It Works / FAQ' }]
export default function PublicStorageLayout() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [location.pathname, location.hash])
  return <div className="discovery-site"><a className="ds-skip" href="#discovery-main">Skip to content</a><main id="discovery-main" className="ds-container" tabIndex={-1}><Outlet /></main><footer className="ds-footer"><div className="ds-container ds-footer-grid"><div><Link to="/" className="ds-brand">SelfStorage<b>.</b></Link><p>Space for your belongings.<br />Room for your life.</p></div><div><h2>Explore</h2>{links.map(l => <Link key={l.to} to={l.to}>{l.label}</Link>)}<Link to="/booking">Book Storage</Link></div><div><h2>Here to help</h2><a href="tel:+84909149563">0909 149 563</a><p>Ho Chi Minh City, Vietnam</p><small>Facility information and prices are sample data.</small></div></div><div className="ds-container ds-footer-bottom">© {new Date().getFullYear()} SelfStorage</div></footer></div>
}
