import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import '../../features/discovery/discovery.css'

const links = [{ to: '/', label: 'Home' }, { to: '/facilities', label: 'Facilities' }, { to: '/pricing', label: 'Pricing & Size Guide' }, { to: '/how-it-works', label: 'How It Works / FAQ' }]
export default function SiteHeader() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [location.pathname, location.hash])
  return <div className="discovery-site shared-header"><header className="ds-header"><div className="ds-container ds-header-inner"><Link to="/" className="ds-brand" aria-label="SelfStorage home"><span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5M12 13v9" /></svg></span>SelfStorage<b>.</b></Link><nav id="site-navigation" className={open ? 'ds-nav open' : 'ds-nav'} aria-label="Main navigation">{links.map(l => <NavLink key={l.to} end={l.to === '/'} to={l.to}>{l.label}</NavLink>)}<NavLink className="ds-mobile-account" to="/customer/units">My Bookings</NavLink></nav><div className="ds-header-actions"><Link className="ds-account" to="/customer/units">My Bookings</Link><Link className="ds-button" to="/booking">Book Storage <span aria-hidden="true">→</span></Link><button type="button" className="ds-menu" onClick={() => setOpen(!open)} aria-controls="site-navigation" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg></button></div></div></header></div>
}
