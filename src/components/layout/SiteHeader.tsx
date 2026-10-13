import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import '../../features/discovery/discovery.css'
import { managerSections, ManagerIcon, managerSectionPath } from '../../pages/Manager/managerNavigation'
import '../../pages/Manager/ManagerDashboard.css'
import './SiteHeader.css'

const links = [{ to: '/', label: 'Home' }, { to: '/facilities', label: 'Facilities' }, { to: '/pricing', label: 'Pricing & Size Guide' }, { to: '/how-it-works', label: 'How It Works / FAQ' }]

/** One underline travels between the active, hovered and keyboard-focused links. */
function useSlidingUnderline(nav: RefObject<HTMLElement>, route: string, open: boolean) {
  useEffect(() => {
    const element = nav.current
    if (!element) return
    let disposed = false
    function place(link: HTMLElement | null) {
      if (!link || !element || !element.getClientRects().length) { element?.style.setProperty('--underline-visible', '0'); return }
      const parent = element.getBoundingClientRect()
      const target = link.getBoundingClientRect()
      element.style.setProperty('--underline-x', `${target.left - parent.left + element.scrollLeft}px`)
      element.style.setProperty('--underline-y', `${target.bottom - parent.top + element.scrollTop - 2}px`)
      element.style.setProperty('--underline-width', `${target.width}px`)
      element.style.setProperty('--underline-visible', '1')
    }
    const restore = () => place(element.querySelector<HTMLElement>('[data-nav-item][aria-current="page"]'))
    const targetLink = (event: Event) => { const target = event.target as HTMLElement; const link = target.closest<HTMLElement>('[data-nav-item]'); if (link && element.contains(link)) place(link) }
    const focusOut = (event: FocusEvent) => { if (!element.contains(event.relatedTarget as Node | null)) restore() }
    const observer = new ResizeObserver(restore)
    observer.observe(element)
    element.querySelectorAll<HTMLElement>('[data-nav-item]').forEach(link => observer.observe(link))
    element.addEventListener('pointerover', targetLink)
    element.addEventListener('pointerleave', restore)
    element.addEventListener('focusin', targetLink)
    element.addEventListener('focusout', focusOut)
    restore()
    document.fonts.ready.then(() => { if (!disposed) restore() })
    return () => { disposed = true; observer.disconnect(); element.removeEventListener('pointerover', targetLink); element.removeEventListener('pointerleave', restore); element.removeEventListener('focusin', targetLink); element.removeEventListener('focusout', focusOut) }
  }, [nav, route, open])
}

export default function SiteHeader() {
  const location = useLocation()
  const isManager = location.pathname === '/manager' || location.pathname.startsWith('/manager/')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 48)
  const navigation = useRef<HTMLElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)
  useSlidingUnderline(navigation, location.pathname, open)
  useEffect(() => { setOpen(false) }, [location.pathname, location.hash])
  useEffect(() => {
    const update = () => setScrolled(current => window.scrollY > (current ? 16 : 48))
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); wrapper.current?.querySelector<HTMLButtonElement>('.ds-menu')?.focus() } }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open])
  const className = `discovery-site shared-header midnight-header${scrolled ? ' is-scrolled' : ''}${isManager ? ' manager-header' : ''}`
  const brand = <Link to={isManager ? '/manager' : '/'} className="ds-brand" aria-label={isManager ? 'SelfStorage Facility Manager' : 'SelfStorage home'}><span><ManagerIcon name="box" /></span>SelfStorage<b>.</b></Link>
  return <div ref={wrapper} className={className}><header className="ds-header"><div className={`ds-container ds-header-inner${isManager ? ' fm-header-inner' : ''}`}>
    {brand}
    {isManager ? <><span className="fm-header-label">FACILITY MANAGER</span><Link className="ds-button secondary" to="/">Home <span aria-hidden="true">↗</span></Link></> : <>
      <nav ref={navigation} id="site-navigation" className={open ? 'ds-nav open' : 'ds-nav'} aria-label="Main navigation">{links.map(link => <NavLink data-nav-item key={link.to} end={link.to === '/'} to={link.to}><span>{link.label}</span></NavLink>)}<NavLink data-nav-item className="ds-mobile-account" to="/customer/units"><span>My Bookings</span></NavLink><span className="nav-sliding-underline" aria-hidden="true" /></nav>
      <div className="ds-header-actions"><Link className="ds-account" to="/customer/units">My Bookings</Link><Link className="ds-button secondary" to="/manager" aria-label="Chuyển sang giao diện Facility Manager">FM <span aria-hidden="true">↗</span></Link><Link className="ds-button" to="/booking">Book Storage <span aria-hidden="true">→</span></Link><button type="button" className="ds-menu" onClick={() => setOpen(!open)} aria-controls="site-navigation" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d={open ? 'M6 6l12 12M6 18 18 6' : 'M4 6h16M4 12h16M4 18h16'} /></svg></button></div>
    </>}
    </div>{isManager && <nav ref={navigation} className="ds-container fm-header-nav" aria-label="Facility management">{managerSections.map(item => <Link data-nav-item key={item.id} to={managerSectionPath(item.id)} className={location.pathname === managerSectionPath(item.id) ? 'active' : ''} aria-current={location.pathname === managerSectionPath(item.id) ? 'page' : undefined}><span>{item.title}</span></Link>)}<span className="nav-sliding-underline" aria-hidden="true" /></nav>}
  </header></div>
}
