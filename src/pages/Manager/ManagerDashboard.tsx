import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { managerSections, ManagerIcon, managerSectionPath } from './managerNavigation'
import './ManagerDashboard.css'
import { loadWorkspace, reports } from './facilityWorkspace'

export default function ManagerDashboard() {
  const { hash } = useLocation()
  const [overview] = useState(() => { try { return reports(loadWorkspace(localStorage)) } catch { return null } })
  const section = managerSections.find(item => item.id === hash.slice(1))
  useEffect(() => { const previous = document.title; document.title = 'Facility Manager — SelfStorage'; return () => { document.title = previous } }, [])
  if (section) return <Navigate to={managerSectionPath(section.id)} replace />
  return <div className="fm-page">
    <main className="fm-container">
      <div className="fm-context"><Link to="/manager">Facility Manager</Link><span>/</span><span>Overview</span><span className="fm-demo">Dữ liệu minh họa</span></div>
      <section className="fm-hero">
        <div className="fm-hero-copy"><span className="fm-eyebrow">YOUR FACILITY. ONE WORKSPACE.</span><h1>Không gian của bạn.<br /><em>Quản lý theo cách bạn.</em></h1><p>Chào Facility Manager, quản lý kho, kết nối đội ngũ và theo dõi hoạt động cơ sở từ một nơi.</p><div className="fm-hero-actions"><Link className="ds-button" to="/manager/units">Quản lý kho <ManagerIcon name="arrow" size={17} /></Link><Link className="ds-button secondary" to="/manager/reports">Xem báo cáo</Link></div><div className="fm-facility">District 1 <span>·</span> Ho Chi Minh City <span className="fm-status">Cơ sở minh họa</span></div></div>
        <div className="fm-hero-image"><img src="/images/storage-hero.webp" alt="Không gian kho SelfStorage với các dãy kho riêng biệt" /><div className="fm-image-note"><span className="fm-icon"><ManagerIcon name="box" /></span><div><strong>Mọi hoạt động trong tầm tay</strong><p>Kho · Khách thuê · Đội ngũ</p></div></div></div>
      </section>
      {overview ? <section className="fm-stats" aria-label="Tổng quan cơ sở">{[['box', 'Tổng số kho', String(overview.total), `${overview.available} kho còn trống`], ['key', 'Tỷ lệ sử dụng', `${overview.total ? Math.round(overview.rented / overview.total * 100) : 0}%`, `${overview.rented} kho đang thuê`], ['card', 'Doanh thu đã thanh toán', new Intl.NumberFormat('vi-VN').format(overview.revenue) + ' ₫', 'Tổng trong dữ liệu demo'], ['calendar', 'Hợp đồng quá hạn', String(overview.overdue.length), 'Cần theo dõi và xử lý']].map(([icon, label, value, note]) => <article key={label}><span className="fm-icon"><ManagerIcon name={icon} /></span><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}</section> : <p role="alert">Không thể đọc dữ liệu cơ sở đã lưu.</p>}
      <section className="fm-workspace" aria-labelledby="workspace-title"><div className="fm-section-heading"><div><span className="fm-eyebrow">FACILITY WORKSPACE</span><h2 id="workspace-title">Một cơ sở. Sáu công cụ quản lý.</h2><p>Chọn chức năng để xem và quản lý từng hoạt động tại cơ sở.</p></div></div>
      <div className="fm-function-grid">{managerSections.map((item, index) => <Link to={managerSectionPath(item.id)} className="fm-function" key={item.id}><div className="fm-function-top"><span className="fm-icon"><ManagerIcon name={item.icon} /></span><span className="fm-number">0{index + 1}</span></div><h3>{item.title}</h3><p>{item.description}</p><span className="fm-card-link">Mở {item.short.toLowerCase()} <ManagerIcon name="arrow" size={17} /></span></Link>)}</div>
      </section>
      <aside className="fm-bottom"><div><span className="fm-eyebrow">BUILT FOR YOUR EVERYDAY</span><h2>Vận hành liền mạch, từ kho đến con người.</h2><p>Giữ mọi hoạt động của cơ sở rõ ràng và dễ theo dõi.</p></div><ManagerIcon name="box" size={90} /></aside>
    </main><footer className="fm-footer"><div className="fm-container"><strong>SelfStorage<span>.</span></strong><p>Facility Manager Workspace</p><small>© {new Date().getFullYear()} SelfStorage. All rights reserved.</small></div></footer>
  </div>
}
