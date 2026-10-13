import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ManagerIcon } from './managerNavigation'
import { validateUnit, unitTypes, unitStatuses, type ManagedUnit, type UnitDraft } from './storageUnits'
import { loadWorkspace, saveWorkspace, updateWorkspaceUnits } from './facilityWorkspace'
import './ManagerDashboard.css'
import './StorageUnitsPage.css'

const blankDraft = (): UnitDraft => ({ code: '', type: 'Small', area: 5, location: '', price: 850000, status: 'Còn trống' })
const currency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
const fieldNames: Record<keyof UnitDraft, string> = { code: 'Mã kho', type: 'Loại kho', area: 'Diện tích', location: 'Vị trí', price: 'Giá thuê', status: 'Trạng thái' }
type Editor = { kind: 'add' } | { kind: 'edit'; unit: ManagedUnit } | { kind: 'disable'; unit: ManagedUnit }

export default function StorageUnitsPage() {
  const [loaded] = useState(() => { try { return { units: loadWorkspace(localStorage).units, error: '' } } catch { return { units: [] as ManagedUnit[], error: 'Không thể đọc dữ liệu kho đã lưu. Hãy kiểm tra bộ nhớ trình duyệt rồi tải lại trang. Dữ liệu hiện có sẽ không bị ghi đè.' } } })
  const [units, setUnits] = useState(loaded.units)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [editor, setEditor] = useState<Editor | null>(null)
  const [draft, setDraft] = useState<UnitDraft>(blankDraft)
  const [errors, setErrors] = useState<Partial<Record<keyof UnitDraft, string>>>({})
  const [saveError, setSaveError] = useState('')
  const [notice, setNotice] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)
  const errorSummary = useRef<HTMLDivElement>(null)
  useEffect(() => { const previous = document.title; document.title = 'Manage Storage Units — SelfStorage'; return () => { document.title = previous } }, [])
  useEffect(() => {
    if (!editor) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus() }
  }, [editor])
  const filtered = units.filter(unit => (!status || unit.status === status) && (!type || unit.type === type) && `${unit.code} ${unit.location}`.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')))
  function openEditor(next: Editor) {
    setDraft(next.kind === 'add' ? blankDraft() : { ...next.unit })
    setErrors({}); setSaveError(''); setNotice(''); setEditor(next)
  }
  function persist(next: ManagedUnit[], message: string) {
    try { const current = loadWorkspace(localStorage); if (JSON.stringify(current.units) !== JSON.stringify(units)) throw new Error('Danh sách kho đã thay đổi ở trang khác. Tải lại trang trước khi lưu.'); saveWorkspace(localStorage, updateWorkspaceUnits(current, next)) } catch (error) { setSaveError(error instanceof Error ? error.message : 'Không thể lưu dữ liệu. Kiểm tra quyền lưu trữ rồi thử lại.'); return }
    setUnits(next); setNotice(message); dialog.current?.close(); setEditor(null)
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor || editor.kind === 'disable' || loaded.error) return
    setSaveError('')
    const validation = validateUnit(draft, units, editor.kind === 'edit' ? editor.unit.id : undefined)
    setErrors(validation)
    if (Object.keys(validation).length) { requestAnimationFrame(() => errorSummary.current?.focus()); return }
    const unit: ManagedUnit = { ...draft, code: draft.code.trim().toUpperCase(), location: draft.location.trim(), id: editor.kind === 'edit' ? editor.unit.id : crypto.randomUUID() }
    persist(editor.kind === 'edit' ? units.map(item => item.id === unit.id ? unit : item) : [...units, unit], editor.kind === 'edit' ? `Đã cập nhật kho ${unit.code}.` : `Đã thêm kho ${unit.code}.`)
  }
  function change<K extends keyof UnitDraft>(field: K, value: UnitDraft[K]) { setDraft(current => ({ ...current, [field]: value })); setErrors(current => ({ ...current, [field]: undefined })) }
  const invalid = (field: keyof UnitDraft) => ({ 'aria-invalid': !!errors[field], 'aria-describedby': errors[field] ? `unit-${field}-error` : undefined })
  const fieldError = (field: keyof UnitDraft) => errors[field] && <span className="fm-field-error" id={`unit-${field}-error`}>{errors[field]}</span>
  return <div className="fm-page"><main className="fm-container fm-units-main">
    <div className="fm-context"><Link to="/manager">Facility Manager</Link><span>/</span><span>Manage Storage Units</span><span className="fm-demo">Demo · Lưu trên trình duyệt</span></div>
    <div className="fm-units-heading"><div><span className="fm-eyebrow">STORAGE UNIT MANAGEMENT</span><h1>Quản lý kho</h1><p>Thêm, chỉnh sửa và quản lý từng kho tại cơ sở District 1.</p></div><button className="ds-button" onClick={() => openEditor({ kind: 'add' })} disabled={!!loaded.error}><span aria-hidden="true">＋</span> Thêm kho</button></div>
    <section className="fm-unit-counts" aria-label="Thống kê danh sách kho">{[['Tổng số kho', units.length], ['Còn trống', units.filter(unit => unit.status === 'Còn trống').length], ['Đang thuê', units.filter(unit => unit.status === 'Đang thuê').length], ['Ngừng sử dụng', units.filter(unit => unit.status === 'Bảo trì' || unit.status === 'Vô hiệu hóa').length]].map(([label, count]) => <article key={label}><span>{label}</span><strong>{count}</strong></article>)}</section>
    {loaded.error && <p className="fm-form-alert" role="alert">{loaded.error}</p>}
    <p className="fm-unit-notice" role="status">{notice}</p>
    <section className="fm-detail"><div className="fm-units-filters"><label>Tìm kiếm<input type="search" placeholder="Mã kho hoặc vị trí…" value={query} onChange={event => setQuery(event.target.value)} /></label><label>Loại kho<select value={type} onChange={event => setType(event.target.value)}><option value="">Tất cả loại kho</option>{unitTypes.map(value => <option key={value}>{value}</option>)}</select></label><label>Trạng thái<select value={status} onChange={event => setStatus(event.target.value)}><option value="">Tất cả trạng thái</option>{unitStatuses.map(value => <option key={value}>{value}</option>)}</select></label></div>
    <div className="fm-detail-heading"><h2>Danh sách kho <span>({filtered.length})</span></h2><Link className="ds-link" to="/manager">← Tổng quan FM</Link></div>
    <div className="fm-table-wrap"><table><thead><tr>{['Mã kho', 'Loại kho', 'Diện tích', 'Vị trí', 'Giá thuê / tháng', 'Trạng thái', 'Thao tác'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{filtered.map(unit => <tr key={unit.id}><td><strong>{unit.code}</strong></td><td>{unit.type}</td><td>{unit.area} m²</td><td>{unit.location}</td><td>{currency(unit.price)}</td><td><span className={`fm-tag ${unit.status === 'Còn trống' ? 'available' : unit.status === 'Bảo trì' ? 'maintenance' : unit.status === 'Vô hiệu hóa' ? 'inactive' : ''}`}>{unit.status}</span></td><td><div className="fm-row-actions"><button type="button" onClick={() => openEditor({ kind: 'edit', unit })} aria-label={`Chỉnh sửa kho ${unit.code}`}>Chỉnh sửa</button><button type="button" className="fm-disable" onClick={() => openEditor({ kind: 'disable', unit })} disabled={unit.status === 'Vô hiệu hóa'} aria-label={`Vô hiệu hóa kho ${unit.code}`}>{unit.status === 'Vô hiệu hóa' ? 'Đã vô hiệu hóa' : 'Vô hiệu hóa'}</button></div></td></tr>)}</tbody></table></div>
    {!filtered.length && <div className="fm-units-empty"><ManagerIcon name="box" size={32} /><h3>{units.length ? 'Không tìm thấy kho phù hợp' : 'Chưa có kho nào'}</h3><p>{units.length ? 'Thử mã kho khác hoặc bỏ bộ lọc để xem toàn bộ danh sách.' : 'Nhấn Thêm kho để tạo kho đầu tiên.'}</p>{units.length > 0 && <button className="ds-button secondary" onClick={() => { setQuery(''); setStatus(''); setType('') }}>Xóa bộ lọc</button>}</div>}
    </section><p className="fm-unit-footnote">Dữ liệu demo được lưu trong trình duyệt hiện tại và chưa đồng bộ với hệ thống đặt kho.</p>
    {editor && <dialog className="fm-unit-dialog" ref={dialog} onCancel={() => setEditor(null)} onClose={() => setEditor(null)} aria-labelledby="unit-dialog-title"><div className="fm-dialog-heading"><div><span className="fm-eyebrow">STORAGE UNIT</span><h2 id="unit-dialog-title">{editor.kind === 'add' ? 'Thêm kho mới' : editor.kind === 'edit' ? `Chỉnh sửa kho ${editor.unit.code}` : 'Vô hiệu hóa kho'}</h2></div><button className="fm-dialog-close" type="button" onClick={() => dialog.current?.close()} aria-label="Đóng form">×</button></div>
    {saveError && <p className="fm-form-alert" role="alert">{saveError}</p>}
    {editor.kind === 'disable' ? <div className="fm-disable-confirm"><p>Bạn muốn vô hiệu hóa kho <strong>{editor.unit.code}</strong>? Kho vẫn nằm trong danh sách với trạng thái Vô hiệu hóa.</p><p>Bạn có thể kích hoạt lại bằng cách chỉnh sửa trạng thái kho.</p><div className="fm-dialog-actions"><button className="ds-button secondary" onClick={() => dialog.current?.close()}>Hủy</button><button className="ds-button fm-danger" onClick={() => persist(units.map(unit => unit.id === editor.unit.id ? { ...unit, status: 'Vô hiệu hóa' } : unit), `Đã vô hiệu hóa kho ${editor.unit.code}.`)}>Vô hiệu hóa</button></div></div> : <form noValidate onSubmit={submit}>
      {Object.values(errors).some(Boolean) && <div className="fm-form-alert" role="alert" tabIndex={-1} ref={errorSummary}><strong>Kiểm tra lại thông tin kho</strong>{Object.entries(errors).filter(([, message]) => message).map(([field, message]) => <a key={field} href={`#unit-${field}`} onClick={event => { event.preventDefault(); document.getElementById(`unit-${field}`)?.focus() }}>{fieldNames[field as keyof UnitDraft]}: {message}</a>)}</div>}
      <p className="fm-form-hint">Điền đầy đủ các trường bên dưới. Giá thuê tính theo tháng.</p><div className="fm-form-grid">
      <label htmlFor="unit-code">Mã kho<input id="unit-code" autoFocus required maxLength={30} placeholder="Ví dụ: A-103" value={draft.code} onChange={event => change('code', event.target.value)} {...invalid('code')} />{fieldError('code')}</label>
      <label htmlFor="unit-type">Loại kho<select id="unit-type" value={draft.type} onChange={event => change('type', event.target.value as UnitDraft['type'])} {...invalid('type')}>{unitTypes.map(value => <option key={value}>{value}</option>)}</select>{fieldError('type')}</label>
      <label htmlFor="unit-area">Diện tích (m²)<input id="unit-area" type="number" min="0.01" max="10000" step="any" required value={Number.isFinite(draft.area) ? draft.area : ''} onChange={event => change('area', event.target.valueAsNumber)} {...invalid('area')} />{fieldError('area')}</label>
      <label htmlFor="unit-price">Giá thuê / tháng (VNĐ)<input id="unit-price" type="number" min="1" step="1" required value={Number.isFinite(draft.price) ? draft.price : ''} onChange={event => change('price', event.target.valueAsNumber)} {...invalid('price')} />{fieldError('price')}</label>
      <label className="fm-form-full" htmlFor="unit-location">Vị trí<input id="unit-location" required maxLength={120} placeholder="Ví dụ: Tầng 1 · Khu A" value={draft.location} onChange={event => change('location', event.target.value)} {...invalid('location')} />{fieldError('location')}</label>
      <label className="fm-form-full" htmlFor="unit-status">Trạng thái<select id="unit-status" value={draft.status} onChange={event => change('status', event.target.value as UnitDraft['status'])} {...invalid('status')}>{unitStatuses.map(value => <option key={value}>{value}</option>)}</select>{fieldError('status')}</label>
      </div><div className="fm-dialog-actions"><button type="button" className="ds-button secondary" onClick={() => dialog.current?.close()}>Hủy</button><button type="submit" className="ds-button">{editor.kind === 'add' ? 'Thêm kho' : 'Lưu thay đổi'}</button></div>
    </form>}</dialog>}
  </main></div>
}
