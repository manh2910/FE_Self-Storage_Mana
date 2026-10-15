import IncomingHandovers from '../components/IncomingHandoversPanel'
import StaffManagement from './StaffManagementPage'
import { parseManagerData } from '../model/managerStorage'
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { managerSections } from '../components/managerNavigation'
import { loadWorkspace, saveWorkspace, assignUnit, candidates, rentalAction, reports, today, type Workspace, type Rental, type Task } from '../model/facilityWorkspace'

// Shared Tailwind utilities stay beside the components that use them.
const styles = {
  fmPage: [
    "[--fm-blue:#2563eb] [--fm-ink:#14263d] [--fm-muted:#52647a] [--fm-border:#dce4ee] bg-none bg-[color:#fff]",
    "bg-clip-border text-[color:var(--fm-ink)] leading-[1.6] [&_h2]:text-[length:27px] [&_h2]:font-bold",
    "[&_h2]:tracking-[-.7px] [&_h2]:leading-[1.35] [&_h2]:mt-[9px] [&_h2]:mb-2.5 [&_h2]:mx-0 [&_h3]:text-[length:16px]",
    "[&_h3]:font-bold [&_h3]:m-0 [&_:is(a,button):focus-visible]:[outline:3px_solid_#2563eb]",
    "[&_:is(a,button):focus-visible]:[outline-offset:4px] max-[720px]:[&_h2]:text-[length:24px]",
    "motion-reduce:[&_*]:![transition:none] [&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:block",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:w-full",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:bg-none",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:bg-[color:#fff]",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:bg-clip-border",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:mt-2",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:text-[length:13px]",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:min-h-11",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:text-[color:var(--fm-ink)]",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:font-normal",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:px-3",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:py-2.5",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:rounded-[8px]",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:border",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:border-solid",
    "[&_:is(.fm-units-filters,.fm-form-grid)_:is(input,select)]:border-[color:#b8c6d8]",
    "[&_:is(input,select):focus-visible]:[outline:3px_solid_#2563eb]",
    "[&_:is(input,select):focus-visible]:[outline-offset:2px]",
    "[&_:is(input,select)[aria-invalid=true]]:border-[color:#b91c1c]",
  ].join(' '),
  fmContainerFmUnitsMain: [
    "max-w-[1200px] pt-0 pb-[60px] min-h-[calc(100vh_-_132px)] px-6 m-auto [.fm-footer>&]:flex",
    "[.fm-footer>&]:items-center [.fm-footer>&]:flex-wrap [.fm-footer>&]:gap-[25px] max-[720px]:px-5 max-[720px]:py-0",
  ].join(' '),
  fmFormAlert: [
    "bg-none bg-[color:#fef2f2] bg-clip-border text-[color:#991b1b] text-[length:12px] mt-0 mb-[18px] px-4 py-3 mx-0",
    "rounded-[8px] border border-solid border-[color:#fecaca] [&_a]:block [&_a]:underline [&_a]:mt-[5px]",
  ].join(' '),
  fmTag: [
    "bg-none bg-[color:#eff6ff] bg-clip-border text-[color:#1d4ed8] px-2.5 py-[5px] rounded-[20px] [&.available]:bg-none",
    "[&.available]:bg-[color:#ecfdf5] [&.available]:bg-clip-border [&.available]:text-[color:#166534]",
    "[&.maintenance]:bg-none [&.maintenance]:bg-[color:#fffbeb] [&.maintenance]:bg-clip-border",
    "[&.maintenance]:text-[color:#92400e] [&.inactive]:text-[color:#475569] [&.inactive]:bg-none",
    "[&.inactive]:bg-[color:#e2e8f0] [&.inactive]:bg-clip-border",
  ].join(' '),
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
  fmDetailFwSection: [
    "overflow-hidden mt-6 rounded-[16px] border border-solid border-[color:var(--fm-border)] [&_table]:w-full",
    "[&_table]:border-collapse [&_table]:text-left [&_table]:text-[length:12px] [&_table]:whitespace-nowrap",
    "[&_th]:bg-none [&_th]:bg-[color:#f8fafc] [&_th]:bg-clip-border [&_th]:text-[color:var(--fm-muted)]",
    "[&_th]:font-semibold [&_th]:px-6 [&_th]:py-4 [&_td]:[border-top-width:1px] [&_td]:[border-top-style:solid]",
    "[&_td]:[border-top-color:var(--fm-border)] [&_td]:px-6 [&_td]:py-5 [.fm-units-main_&_td]:px-5",
    "[.fm-units-main_&_td]:py-[18px] [.fm-units-main_&_th]:px-5 [.fm-units-main_&_th]:py-4",
  ].join(' '),
  fmDetailHeading: [
    "flex flex-wrap items-center justify-between [border-bottom-width:1px] [border-bottom-style:solid]",
    "[border-bottom-color:var(--fm-border)] px-6 py-[22px] gap-3 [.fm-units-main_&_h2]:text-[length:17px]",
    "[.fm-units-main_&_h2]:m-0 [.fm-units-main_&_h2_span]:text-[length:13px] [.fm-units-main_&_h2_span]:font-medium",
    "[.fm-units-main_&_h2_span]:text-[color:var(--fm-muted)] max-[520px]:[.fm-units-main_&]:p-[18px]",
  ].join(' '),
  fmDetail: [
    "overflow-hidden rounded-[16px] border border-solid border-[color:var(--fm-border)] [&_table]:w-full",
    "[&_table]:border-collapse [&_table]:text-left [&_table]:text-[length:12px] [&_table]:whitespace-nowrap",
    "[&_th]:bg-none [&_th]:bg-[color:#f8fafc] [&_th]:bg-clip-border [&_th]:text-[color:var(--fm-muted)]",
    "[&_th]:font-semibold [&_th]:px-6 [&_th]:py-4 [&_td]:[border-top-width:1px] [&_td]:[border-top-style:solid]",
    "[&_td]:[border-top-color:var(--fm-border)] [&_td]:px-6 [&_td]:py-5 [.fm-units-main_&_td]:px-5",
    "[.fm-units-main_&_td]:py-[18px] [.fm-units-main_&_th]:px-5 [.fm-units-main_&_th]:py-4",
  ].join(' '),
  fmUnitCounts: [
    "grid grid-cols-[repeat(4,1fr)] gap-[18px] [&_article]:bg-none [&_article]:bg-[color:#f8fafc]",
    "[&_article]:bg-clip-border [&_article]:flex [&_article]:justify-between [&_article]:items-center",
    "[&_article]:px-[22px] [&_article]:py-[18px] [&_article]:gap-3 [&_article]:rounded-[12px] [&_article]:border",
    "[&_article]:border-solid [&_article]:border-[color:var(--fm-border)] [&_span]:text-[length:12px]",
    "[&_span]:text-[color:var(--fm-muted)] [&_strong]:text-[length:26px] [&_strong]:font-[750]",
    "[&_strong]:text-[color:var(--fm-ink)] max-[800px]:grid-cols-[repeat(2,1fr)] max-[520px]:gap-2.5",
    "max-[520px]:[&_article]:p-3.5 max-[520px]:[&_span]:text-[length:11px]",
  ].join(' '),
} as const


const money=(value:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'VND'}).format(value)
const date=(value:string)=>value.split('-').reverse().join('/')
type Mode='payments'|'support'|'assign'|'rentals'|'operations'|'staff'|'reports'
type Action={kind:'handover'|'return'|'renew'|'reassign';rental:Rental}|{kind:'task';task?:Task}
function Table({heads,rows}:{heads:string[];rows:ReactNode[][]}) { return <div className="fm-table-wrap overflow-x-auto"><table><thead><tr>{heads.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table>{!rows.length&&<p className="fw-empty text-[length:12px] text-[color:var(--fm-muted)] leading-[1.8] p-5">No matching data.</p>}</div> }
export default function FacilityWorkspacePage({mode}:{mode:Mode}) {
  const [initial]=useState(()=>{try{return {value:loadWorkspace(localStorage),error:''}}catch{return {value:null,error:'Unable to load facility data. Check browser storage and reload. Saved data will be preserved.'}}})
  const [w,setW]=useState<Workspace|null>(initial.value)
  const [error,setError]=useState(initial.error)
  const [notice,setNotice]=useState('')
  const [search,setSearch]=useState('')
  const [filter,setFilter]=useState('active')
  const [requestId,setRequestId]=useState('')
  const [unitId,setUnitId]=useState('')
  const [action,setAction]=useState<Action|null>(null)
  const [value,setValue]=useState('')
  const [taskDraft,setTaskDraft]=useState({title:'',staffId:'',unitId:'',due:today(),status:'Pending' as Task['status']})
  const [dialogError,setDialogError]=useState('')
  const dialog=useRef<HTMLDialogElement>(null)
  const section=managerSections.find(s=>s.id===mode)!
  useEffect(()=>{setSearch('');setFilter('active');setError(initial.error);setNotice('');setRequestId('');setUnitId('')},[mode,initial.error])
  useEffect(()=>{const previous=document.title;document.title=`${section.title} — SelfStorage`;return()=>{document.title=previous}},[section.title])
  useEffect(()=>{if(!action)return;const focus=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;dialog.current?.showModal();document.body.style.overflow='hidden';return()=>{document.body.style.overflow=overflow;focus?.focus()}},[action])
  function commit(next:Workspace,message:string,inDialog=false) {try{saveWorkspace(localStorage,next);setW(next);setNotice(message);setError('');if(inDialog){dialog.current?.close();setAction(null)}return true}catch{const message='Unable to save changes. Check storage permissions or available space and try again.';if(inDialog)setDialogError(message);else setError(message);return false} }
  function open(next:Action){setValue('');setDialogError('');setTaskDraft(next.kind==='task'&&next.task?{...next.task}:{title:'',staffId:w?.staff[0]?.id||'',unitId:'',due:today(),status:'Pending'});setAction(next)}
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!w||!action)return;try{
    // Re-read before mutation so another tab's assignment cannot be overwritten.
    const current=loadWorkspace(localStorage)
    if(action.kind==='task'){
      if(!taskDraft.title.trim()||!current.staff.some(s=>s.id===taskDraft.staffId)||!/^\d{4}-\d{2}-\d{2}$/.test(taskDraft.due)||!Number.isFinite(Date.parse(taskDraft.due))||(taskDraft.unitId&&!current.units.some(u=>u.id===taskDraft.unitId)))throw new Error('Enter a valid task, staff member, unit and due date.')
      const task:Task={...taskDraft,title:taskDraft.title.trim(),id:action.task?.id||crypto.randomUUID()}
      commit({...current,tasks:action.task?current.tasks.map(t=>t.id===task.id?task:t):[...current.tasks,task]},'Staff assignment saved.',true)
    }else commit(rentalAction(current,action.rental.id,action.kind,value),'Unit operations updated.',true)
  }catch(e){setDialogError(e instanceof Error?e.message:'Unable to update data.')}}
  if(!w)return <div className={`fm-page ${styles.fmPage}`}><main className={`fm-container fm-units-main ${styles.fmContainerFmUnitsMain}`}><p role="alert" className={`fm-form-alert ${styles.fmFormAlert}`}>{error}</p><Link to="/manager" className="ds-link [&_svg]:w-[17px] [&_svg]:h-[17px] inline-flex items-center text-[color:#1d4ed8] text-[length:13px] font-[650] min-h-11 gap-2 [.ds-sticky_&]:mt-2">← FM overview</Link></main></div>
  const stats=reports(w)
  const unitName=(id:string)=>w.units.find(u=>u.id===id)?.code||'Unknown'
  const requests=w.requests.filter(r=>!r.rentalId)
  const selected=requests.find(r=>r.id===requestId)
  const options=selected?candidates(w,selected):[]
  const active=w.rentals.filter(r=>r.stage!=='Returned')
  const matches=(r:Rental)=>`${r.customer} ${r.id} ${unitName(r.unitId)}`.toLocaleLowerCase('en').includes(search.toLocaleLowerCase('en'))
  const rentalRows=w.rentals.filter(r=>matches(r)&&(filter==='all'||filter==='active'&&r.stage!=='Returned'||filter==='overdue'&&r.stage!=='Returned'&&r.end<today()||filter==='expiring'&&r.stage!=='Returned'&&r.end>=today()&&Date.parse(r.end)-Date.parse(today())<=7*86400000||filter==='unpaid'&&r.payment==='Pending payment'&&r.stage!=='Returned'))
  const rentalCells=(r:Rental):ReactNode[]=>[<strong>{unitName(r.unitId)}</strong>,r.customer,<span className="fw-contract block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={r.id}>{r.id}</span>,`${date(r.start)} – ${date(r.end)}`,<span className={`fm-tag ${styles.fmTag} ${r.stage==='Returned'?'inactive':r.end<today()?'maintenance':''}`}>{r.stage==='Returned'?'Returned':r.end<today()?'Overdue':r.stage}</span>,money(r.amount),<span className={`fm-tag ${styles.fmTag} ${r.payment==='Paid'?'available':'maintenance'}`}>{r.payment}</span>]
  const replacementOptions=action&&action.kind==='reassign'?(()=>{const u=w.units.find(u=>u.id===action.rental.unitId);return u?candidates(w,{id:'',customer:action.rental.customer,type:u.type,area:u.area,start:action.rental.start,end:action.rental.end},action.rental.id):[]})():[]
  return <div className={`fm-page ${styles.fmPage}`}><main className={`fm-container fm-units-main ${styles.fmContainerFmUnitsMain}`}><div className="fm-context flex items-center text-[length:12px] text-[color:var(--fm-muted)] px-0 py-6 gap-3 [&>a]:text-[color:var(--fm-blue)] max-[720px]:text-[length:10px] max-[720px]:gap-2"><Link to="/manager">Facility Manager</Link><span>/</span><span>{section.short}</span><span className="fm-demo text-[length:11px] text-[color:var(--fm-muted)] bg-none bg-[color:#f1f5f9] bg-clip-border px-2.5 py-[5px] rounded-[6px] [.fm-context>&]:ml-auto max-[520px]:[.fm-context>&]:text-[length:9px] max-[520px]:[.fm-context>&]:max-w-[100px] max-[520px]:[.fm-context>&]:text-center">Demo · District 1</span></div><div className="fm-units-heading flex justify-between items-center pt-[18px] pb-7 px-0 gap-6 [&_h1]:text-[length:34px] [&_h1]:font-[750] [&_h1]:tracking-[-1px] [&_h1]:leading-[1.3] [&_h1]:mx-0 [&_h1]:my-2.5 [&_p]:text-[length:14px] [&_p]:text-[color:var(--fm-muted)] max-[520px]:[align-items:start] max-[520px]:flex-col max-[520px]:gap-[18px] max-[520px]:[&_h1]:text-[length:28px]"><div><span className="fm-eyebrow text-[length:10px] font-[750] tracking-[1.8px] text-[color:var(--fm-blue)]">FACILITY WORKSPACE</span><h1>{section.title}</h1><p>{section.description}</p></div><Link className="ds-link [&_svg]:w-[17px] [&_svg]:h-[17px] inline-flex items-center text-[color:#1d4ed8] text-[length:13px] font-[650] min-h-11 gap-2 [.ds-sticky_&]:mt-2" to="/manager">← Overview</Link></div>
  <p className="fm-unit-notice min-h-6 text-[color:#166534] text-[length:13px] mx-0 my-4" role="status">{notice}</p>{error&&<p role="alert" className={`fm-form-alert ${styles.fmFormAlert}`}>{error}</p>}
  {mode==='support'&&<SupportRequests staff={w.staff} />}
  {mode==='payments'&&<><section className={`fm-unit-counts ${styles.fmUnitCounts}`}>{[['Paid',money(stats.revenue)],['Outstanding balance',money(w.rentals.filter(r=>r.payment==='Pending payment').reduce((sum,r)=>sum+r.amount,0))],['Unpaid items',w.rentals.filter(r=>r.payment==='Pending payment').length]].map(([label,count])=><article key={label}><span>{label}</span><strong>{count}</strong></article>)}</section><section className={`fm-detail fw-section ${styles.fmDetailFwSection}`}><div className={styles.fmDetailHeading}><h2>Payments & outstanding balances</h2></div><Table heads={['Unit','Customer','Contract','Period','Rental status','Amount','Payment','Alert']} rows={w.rentals.map(r=>[...rentalCells(r),r.payment==='Pending payment'&&r.end<today()?'Unpaid · contract expired':'—'])}/><p className="p-5 text-sm text-slate-600">Alerts use contract end dates. Separate payment due dates are not available yet.</p></section></>}
  {mode==='assign'&&<><section className="fm-detail fw-panel overflow-hidden p-[26px] rounded-[16px] border border-solid border-[color:var(--fm-border)] [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-[length:12px] [&_table]:whitespace-nowrap [&_th]:bg-none [&_th]:bg-[color:#f8fafc] [&_th]:bg-clip-border [&_th]:text-[color:var(--fm-muted)] [&_th]:font-semibold [&_th]:px-6 [&_th]:py-4 [&_td]:[border-top-width:1px] [&_td]:[border-top-style:solid] [&_td]:[border-top-color:var(--fm-border)] [&_td]:px-6 [&_td]:py-5 [.fm-units-main_&_td]:px-5 [.fm-units-main_&_td]:py-[18px] [.fm-units-main_&_th]:px-5 [.fm-units-main_&_th]:py-4 [&>p]:text-[length:13px] [&>p]:text-[color:var(--fm-muted)] [&>p]:mt-3 [&>p]:mb-[22px] [&>p]:mx-0 max-[520px]:p-5"><h2>Allocate a unit to a reservation</h2><p>Select a reservation to find units matching the type, size and rental period.</p><form className="fw-allocation grid grid-cols-[1.4fr_1.2fr_auto] [align-items:end] gap-[18px] [&_label]:text-[length:12px] [&_label]:font-semibold [&_select]:block [&_select]:w-full [&_select]:bg-none [&_select]:bg-[color:white] [&_select]:bg-clip-border [&_select]:mt-2 [&_select]:min-h-11 [&_select]:text-[length:13px] [&_select]:px-3 [&_select]:py-2.5 [&_select]:rounded-[8px] [&_select]:border [&_select]:border-solid [&_select]:border-[color:#b8c6d8] max-[850px]:grid-cols-[1fr]" onSubmit={event=>{event.preventDefault();try{const next=assignUnit(loadWorkspace(localStorage),requestId,unitId);if(commit(next,'Unit allocated. Contract is awaiting handover.')){setRequestId('');setUnitId('')}}catch(e){setError(e instanceof Error?e.message:'Unable to allocate a unit.')}}}><label>Reservation<select required value={requestId} onChange={event=>{setRequestId(event.target.value);setUnitId('')}}><option value="">Select reservation</option>{requests.map(r=><option key={r.id} value={r.id}>{r.id} · {r.customer} · {r.type} / {r.area} m²</option>)}</select></label><label>Suitable unit<select required value={unitId} onChange={event=>setUnitId(event.target.value)} disabled={!selected||!options.length}><option value="">{selected&&!options.length?'No suitable units available':'Select unit'}</option>{options.map(u=><option key={u.id} value={u.id}>{u.code} · {u.area} m² · {money(u.price)}/month</option>)}</select></label><button className={`ds-button ${styles.dsButton}`} disabled={!unitId}>Allocate unit</button></form>{selected&&<p className="fw-period bg-none bg-[color:#eff6ff] bg-clip-border p-3 rounded-[8px]">Rental period: {date(selected.start)} → {date(selected.end)}{!options.length&&' · No suitable units available. Review or add units before allocating.'}</p>}</section><section className={`fm-detail fw-section ${styles.fmDetailFwSection}`}><div className={`fm-detail-heading ${styles.fmDetailHeading}`}><h2>Reservations awaiting allocation ({requests.length})</h2></div><Table heads={['Reservation ID','Customer','Type / Area','Rental period']} rows={requests.map(r=>[r.id,r.customer,`${r.type} · ${r.area} m²`,`${date(r.start)} – ${date(r.end)}`])}/></section><section className={`fm-detail fw-section ${styles.fmDetailFwSection}`}><div className={`fm-detail-heading ${styles.fmDetailHeading}`}><h2>Allocated units · Awaiting handover</h2></div><Table heads={['Unit','Tenant','Period','Issue resolution']} rows={active.filter(r=>r.stage==='Awaiting handover').map(r=>[unitName(r.unitId),r.customer,`${date(r.start)} – ${date(r.end)}`,<button className={`ds-button secondary ${styles.dsButton}`} onClick={()=>open({kind:'reassign',rental:r})}>Reassign unavailable unit</button>])}/></section></>}
  {mode==='rentals'&&<section className={`fm-detail ${styles.fmDetail}`}><div className="fm-units-filters grid grid-cols-[2fr_1fr_1fr] bg-none bg-[color:#f8fafc] bg-clip-border [border-bottom-width:1px] [border-bottom-style:solid] [border-bottom-color:var(--fm-border)] px-6 py-[22px] gap-5 [&_label]:text-[length:12px] [&_label]:font-[650] [&_label]:text-[color:var(--fm-ink)] max-[800px]:grid-cols-[1fr_1fr] max-[800px]:[&_label:first-child]:col-span-full max-[520px]:p-[18px] max-[520px]:gap-3.5 [&_select]:block [&_select]:w-full [&_select]:bg-none [&_select]:bg-[color:white] [&_select]:bg-clip-border [&_select]:mt-2 [&_select]:min-h-11 [&_select]:text-[length:13px] [&_select]:px-3 [&_select]:py-2.5 [&_select]:rounded-[8px] [&_select]:border [&_select]:border-solid [&_select]:border-[color:#b8c6d8]"><label>Search customer / unit / contract<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Customer name or unit code…" /></label><label>Contract<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="active">Occupied / awaiting handover</option><option value="expiring">Expiring within 7 days</option><option value="overdue">Overdue</option><option value="unpaid">Pending payment</option><option value="all">All contracts</option></select></label></div><div className={`fm-detail-heading ${styles.fmDetailHeading}`}><h2>Contracts ({rentalRows.length})</h2></div><Table heads={['Unit','Tenant','Contract','Period','Status','Rent / demo period','Payment','Actions']} rows={rentalRows.map(r=>[...rentalCells(r),r.stage!=='Returned'?<div className="flex gap-2"><button className={styles.dsButton} onClick={()=>open({kind:'renew',rental:r})}>Renew</button>{r.stage==='Occupied'&&<button className={styles.dsButton} onClick={()=>open({kind:'return',rental:r})}>Terminate & accept return</button>}</div>:'Ended'])}/><p className="fw-inline-note text-[length:12px] text-[color:var(--fm-muted)] leading-[1.8] p-5">Payment status is for monitoring. Facility managers do not confirm transactions here.</p></section>}
  {mode==='operations'&&<><IncomingHandovers workspace={w} commit={commit} onHandover={rental=>open({kind:'handover',rental})}/><div className={`fm-unit-counts ${styles.fmUnitCounts}`}>{[['Awaiting handover',active.filter(r=>r.stage==='Awaiting handover').length],['Occupied',active.filter(r=>r.stage==='Occupied').length],['Overdue',stats.overdue.length],['Returned units',w.rentals.filter(r=>r.stage==='Returned').length]].map(([label,count])=><article key={label}><span>{label}</span><strong>{count}</strong></article>)}</div><section className={`fm-detail fw-section ${styles.fmDetailFwSection}`}><div className={`fm-detail-heading ${styles.fmDetailHeading}`}><h2>Handed-over units, returns & renewals</h2></div><Table heads={['Unit','Tenant','Contract end date','Status','Actions']} rows={active.filter(r=>r.stage==='Occupied').map(r=>[unitName(r.unitId),r.customer,date(r.end),<span className={`fm-tag ${styles.fmTag} ${r.end<today()?'maintenance':''}`}>{r.end<today()?'Overdue':r.stage}</span>,<div className="fm-row-actions flex items-center gap-3 [&_button]:min-h-10 [&_button]:text-[color:#1d4ed8] [&_button]:bg-none [&_button]:bg-[color:#eff6ff] [&_button]:bg-clip-border [&_button]:cursor-pointer [&_button]:text-[length:11px] [&_button]:font-semibold [&_button]:px-2.5 [&_button]:py-[7px] [&_button]:rounded-[7px] [&_button]:border [&_button]:border-solid [&_button]:border-[color:#bfdbfe] [&_button:hover]:bg-none [&_button:hover]:bg-[color:#dbeafe] [&_button:hover]:bg-clip-border [&_button:disabled]:text-[color:#64748b] [&_button:disabled]:bg-none [&_button:disabled]:bg-[color:#f1f5f9] [&_button:disabled]:bg-clip-border [&_button:disabled]:cursor-not-allowed [&_button:disabled]:border-[color:#dce4ee]">{r.stage==='Awaiting handover'?<button onClick={()=>open({kind:'handover',rental:r})}>Record handover</button>:<button onClick={()=>open({kind:'return',rental:r})}>Record return</button>}<button onClick={()=>open({kind:'renew',rental:r})}>Renew</button></div>])}/></section><p className="fw-inline-note text-[length:12px] text-[color:var(--fm-muted)] leading-[1.8] p-5">Facility staff perform on-site work. The manager records verified results in this demo.</p></>}
  {mode==='staff'&&<StaffManagement workspace={w} commit={commit} />}
  {mode==='reports'&&<><section className={`fm-unit-counts ${styles.fmUnitCounts}`}>{[['Total units',stats.total],['Available units',stats.available],['Occupied units',stats.rented],['Occupancy rate',`${stats.total?Math.round(stats.rented/stats.total*100):0}%`]].map(([label,count])=><article key={label}><span>{label}</span><strong>{count}</strong></article>)}</section><section className="fm-detail fw-panel fw-section overflow-hidden mt-6 p-[26px] rounded-[16px] border border-solid border-[color:var(--fm-border)] [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-[length:12px] [&_table]:whitespace-nowrap [&_th]:bg-none [&_th]:bg-[color:#f8fafc] [&_th]:bg-clip-border [&_th]:text-[color:var(--fm-muted)] [&_th]:font-semibold [&_th]:px-6 [&_th]:py-4 [&_td]:[border-top-width:1px] [&_td]:[border-top-style:solid] [&_td]:[border-top-color:var(--fm-border)] [&_td]:px-6 [&_td]:py-5 [.fm-units-main_&_td]:px-5 [.fm-units-main_&_td]:py-[18px] [.fm-units-main_&_th]:px-5 [.fm-units-main_&_th]:py-4 [&>p]:text-[length:13px] [&>p]:text-[color:var(--fm-muted)] [&>p]:mt-3 [&>p]:mb-[22px] [&>p]:mx-0 max-[520px]:p-5"><h2>Paid revenue</h2><strong className="fw-revenue block text-[length:36px] text-[color:var(--fm-blue)] font-[750] mx-0 my-3 max-[850px]:text-[length:29px]">{money(stats.revenue)}</strong><p>Total paid contract revenue in the demo, including returned units. Pending payments are excluded.</p><h3>Unit distribution</h3>{['Available','Occupied','Cleaning','Maintenance','Deactivated'].map(status=>{const count=w.units.filter(u=>u.status===status).length;return <div className="fm-bar mt-[22px] [&>div:first-child]:flex [&>div:first-child]:justify-between [&>div:first-child]:text-[length:12px] [.fw-panel_&]:max-w-[700px]" key={status}><div><span>{status}</span><strong>{count} units</strong></div><div className="fm-bar-track h-2.5 bg-none bg-[color:#edf2fa] bg-clip-border mt-2.5 overflow-hidden rounded-[10px] [&_span]:block [&_span]:h-full [&_span]:bg-none [&_span]:bg-[color:var(--fm-blue)] [&_span]:bg-clip-border [&_span]:rounded-[10px]"><span style={{width:`${stats.total?count/stats.total*100:0}%`}} /></div></div>})}</section><section className={`fm-detail fw-section ${styles.fmDetailFwSection}`}><div className={`fm-detail-heading ${styles.fmDetailHeading}`}><h2>Expired contracts ({stats.overdue.length})</h2></div><Table heads={['Unit','Tenant','Contract','Period','Status','Rent / demo period','Payment']} rows={stats.overdue.map(rentalCells)}/></section></>}
  {mode==='reports'&&<section className={`fm-detail fw-section ${styles.fmDetailFwSection}`}><div className={styles.fmDetailHeading}><h2>Staff performance</h2></div><Table heads={['Staff','Total tasks','Completed','Completion rate']} rows={w.staff.map(staff=>{const tasks=w.tasks.filter(t=>t.staffId===staff.id);const done=tasks.filter(t=>t.status==='Completed').length;return [staff.name,tasks.length,done,`${tasks.length?Math.round(done/tasks.length*100):0}%`]})}/></section>}
  <p className="fm-unit-footnote text-[length:11px] text-[color:var(--fm-muted)] mt-5">District 1 demo data is saved in this browser and is not connected to an API.</p>
  {action&&<dialog ref={dialog} className="fm-unit-dialog fixed top-0 right-0 bottom-0 left-0 bg-none bg-[color:white] bg-clip-border text-[color:var(--fm-ink)] w-[min(600px,calc(100%_-_32px))] max-h-[calc(100dvh_-_40px)] overflow-y-auto [box-shadow:0_25px_80px_#14263d30] p-7 m-auto rounded-[18px] border border-solid border-[color:var(--fm-border)] [&::backdrop]:bg-none [&::backdrop]:bg-[color:#0f172a80] [&::backdrop]:bg-clip-border [&::backdrop]:[backdrop-filter:blur(3px)] max-[520px]:p-[22px]" onCancel={()=>setAction(null)} onClose={()=>setAction(null)} aria-labelledby="fw-dialog-title"><div className="fm-dialog-heading flex [align-items:start] justify-between gap-4 [&_h2]:text-[length:25px] [&_h2]:mb-4 max-[520px]:[&_h2]:text-[length:22px]"><h2 id="fw-dialog-title">{action.kind==='task'?'Assign task':action.kind==='renew'?'Renew contract':action.kind==='return'?'Record return':action.kind==='reassign'?'Reassign handover unit':'Record handover'}</h2><button className="fm-dialog-close w-10 h-10 shrink-0 bg-none bg-[color:#f8fafc] bg-clip-border text-[color:var(--fm-muted)] text-[length:26px] cursor-pointer rounded-[8px] border border-solid border-[color:var(--fm-border)] [&:hover]:bg-none [&:hover]:bg-[color:#e2e8f0] [&:hover]:bg-clip-border" onClick={()=>dialog.current?.close()} aria-label="Close">×</button></div>{dialogError&&<p className={`fm-form-alert ${styles.fmFormAlert}`} role="alert">{dialogError}</p>}<form onSubmit={submit}><div className="fm-form-grid [&_label]:text-[length:12px] [&_label]:font-[650] [&_label]:text-[color:var(--fm-ink)] grid grid-cols-[1fr_1fr] gap-[18px] max-[520px]:grid-cols-[1fr]">{action.kind==='task'?<><label className="fm-form-full col-span-full">Task<input autoFocus required maxLength={200} value={taskDraft.title} onChange={e=>setTaskDraft({...taskDraft,title:e.target.value})}/></label><label>Staff<select required value={taskDraft.staffId} onChange={e=>setTaskDraft({...taskDraft,staffId:e.target.value})}>{w.staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>Unit / Area<select value={taskDraft.unitId} onChange={e=>setTaskDraft({...taskDraft,unitId:e.target.value})}><option value="">Entire facility</option>{w.units.map(u=><option key={u.id} value={u.id}>{u.code}</option>)}</select></label><label>Due date<input type="date" required value={taskDraft.due} onChange={e=>setTaskDraft({...taskDraft,due:e.target.value})}/></label><label>Progress<select value={taskDraft.status} onChange={e=>setTaskDraft({...taskDraft,status:e.target.value as Task['status']})}>{['Pending','In progress','Completed'].map(s=><option key={s}>{s}</option>)}</select></label></>:<><p className="fm-form-full col-span-full">Unit <strong>{unitName(action.rental.unitId)}</strong> · {action.rental.customer}</p>{action.kind==='renew'?<label className="fm-form-full col-span-full">New end date<input autoFocus type="date" required min={action.rental.end} value={value} onChange={e=>setValue(e.target.value)}/></label>:action.kind==='reassign'?<><label className="fm-form-full col-span-full">Replacement unit<select autoFocus required value={value} onChange={e=>setValue(e.target.value)}><option value="">Select a suitable unit</option>{replacementOptions.map(u=><option key={u.id} value={u.id}>{u.code} · {u.area} m²</option>)}</select></label><p className="fm-form-full fw-inline-note col-span-full text-[length:12px] text-[color:var(--fm-muted)] leading-[1.8] p-5">The original unit will be marked as under maintenance. {replacementOptions.length?'The replacement retains the existing contract period and amount.':'No suitable replacement units available.'}</p></>:<p className="fm-form-full col-span-full">{action.kind==='return'?'Confirm staff have inspected and accepted the returned unit. The contract is marked Returned and the unit moves to Cleaning. Mark it Available in Storage Unit Management after cleaning.':'Confirm staff have handed the unit over to the customer. The contract becomes Occupied.'}</p>}</>}</div><div className="fm-dialog-actions flex items-center justify-end mt-[26px] pt-5 [border-top-width:1px] [border-top-style:solid] [border-top-color:var(--fm-border)] gap-3"><button type="button" className={`ds-button secondary ${styles.dsButton}`} onClick={()=>dialog.current?.close()}>Cancel</button><button className={`ds-button ${styles.dsButton}`} type="submit" disabled={action.kind==='reassign'&&!replacementOptions.length}>{action.kind==='task'?'Save task':'Confirm'}</button></div></form></dialog>}
  </main></div>
}

const fieldClass = 'mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm'
function useDemoSettings<T,>(key:string, fallback:T) {
  const [state,setState]=useState<T>(()=>{try{return parseManagerData(localStorage.getItem(key)||'null')??fallback}catch{return fallback}})
  const [message,setMessage]=useState('')
  function save(next:T){try{localStorage.setItem(key,JSON.stringify(next));setState(next);setMessage('Changes saved in this browser.')}catch{setMessage('Unable to save changes. Check browser storage.')}}
  return {state,save,message}
}
type SupportTicket={id:string;title:string;staffId:string;approval:boolean;status:string}
function SupportRequests({staff}:{staff:Workspace['staff']}){
  const {state,save,message}=useDemoSettings<SupportTicket[]>('selfstorage:fm-support:v1',[{id:'HT-001',title:'Customer requests help unlocking a unit',staffId:'',approval:false,status:'Awaiting assignment'},{id:'HT-002',title:'Fee waiver request requiring manager approval',staffId:'',approval:true,status:'Awaiting approval'}])
  return <section className={`fm-detail ${styles.fmDetail}`}><div className={styles.fmDetailHeading}><h2>Support requests</h2></div><p role="status" className="px-6 text-sm">{message}</p><Table heads={['Request ID','Description','Assigned staff','Status','Approval / resolution']} rows={state.map(ticket=>{const update=(patch:Partial<SupportTicket>)=>save(state.map(item=>item.id===ticket.id?{...item,...patch}:item));return [ticket.id,ticket.title,<select className={fieldClass} aria-label={`Assign ${ticket.id}`} value={ticket.staffId} onChange={e=>update({staffId:e.target.value,status:ticket.approval?ticket.status:e.target.value?'In progress':'Awaiting assignment'})}><option value="">Unassigned</option>{staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>,ticket.status,<div className="flex gap-2">{ticket.approval&&ticket.status==='Awaiting approval'?<><button className={styles.dsButton} onClick={()=>update({status:'Approved'})}>Approve</button><button className={styles.dsButton} onClick={()=>update({status:'Rejected'})}>Rejected</button></>:<button className={styles.dsButton} disabled={!ticket.staffId||['Completed','Rejected'].includes(ticket.status)} onClick={()=>update({status:'Completed'})}>Completed</button>}</div>]})}/></section>
}

