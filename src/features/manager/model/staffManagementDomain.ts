import { today, validPeriod, type StaffShift, type Task, type Workspace } from './facilityWorkspace'

export function canAssignStaff(w: Workspace, id: string) {
  const member=w.staff.find(s=>s.id===id)
  return !!member && member.status!=='Inactive' && !['On leave','Unavailable'].includes(member.availability||'Available')
}
function validDay(value:string){return validPeriod(value, '9999-12-31')}
export function saveShift(w:Workspace, draft:Omit<StaffShift,'id'>, id?:string):Workspace {
  if(id && !(w.shifts||[]).some(s=>s.id===id))throw new Error('This shift no longer exists. Reload the page.')
  if(!canAssignStaff(w,draft.staffId))throw new Error('Select an active, available staff member.')
  const time=/^([01]\d|2[0-3]):[0-5]\d$/
  if(!validDay(draft.date)||!time.test(draft.start)||!time.test(draft.end)||draft.start>=draft.end)throw new Error('Select a valid date and an end time after the start time. Split overnight shifts into separate dates.')
  if(!draft.label.trim()||draft.label.trim().length>80)throw new Error('Enter a shift name with up to 80 characters.')
  if((w.shifts||[]).some(s=>s.id!==id&&s.staffId===draft.staffId&&s.date===draft.date&&s.start<draft.end&&draft.start<s.end))throw new Error('This shift overlaps another shift for the selected staff member.')
  const shift={...draft,label:draft.label.trim(),id:id||crypto.randomUUID()}
  return {...w,shifts:id?(w.shifts||[]).map(s=>s.id===id?shift:s):[...(w.shifts||[]),shift]}
}
export function removeShift(w:Workspace,id:string):Workspace {
  if(!(w.shifts||[]).some(s=>s.id===id))throw new Error('This shift no longer exists. Reload the page.')
  return {...w,shifts:(w.shifts||[]).filter(s=>s.id!==id)}
}
export function saveStaffTask(w:Workspace,draft:Pick<Task,'title'|'staffId'|'unitId'|'due'|'status'>&{progress:number},id?:string):Workspace {
  const previous=w.tasks.find(t=>t.id===id)
  if(id&&!previous)throw new Error('This task no longer exists. Reload the page.')
  if(!w.staff.some(s=>s.id===draft.staffId))throw new Error('Select a staff member.')
  if((!previous||previous.staffId!==draft.staffId) && !canAssignStaff(w,draft.staffId))throw new Error('This staff member is inactive, on leave or unavailable.')
  if(!draft.title.trim()||draft.title.trim().length>200||!validDay(draft.due)||(draft.unitId&&!w.units.some(u=>u.id===draft.unitId)))throw new Error('Enter a task title, valid due date and unit.')
  if(!['Pending','In progress','Completed'].includes(draft.status)||!Number.isInteger(draft.progress)||draft.progress<0||draft.progress>100)throw new Error('Progress must be a whole number from 0 to 100.')
  if(draft.status==='In progress' && (draft.progress<=0||draft.progress>=100))throw new Error('In-progress tasks must have progress between 1 and 99%.')
  const task:Task={...draft,title:draft.title.trim(),id:id||crypto.randomUUID(),progress:draft.status==='Completed'?100:draft.status==='Pending'?0:draft.progress}
  if(task.status==='Completed')task.completedAt=previous?.status==='Completed'?previous.completedAt||today():today()
  if(previous?.reviewedAt && previous.status==='Completed' && task.status==='Completed' && previous.staffId===task.staffId && previous.title===task.title && previous.due===task.due && previous.unitId===task.unitId)task.reviewedAt=previous.reviewedAt
  return {...w,tasks:id?w.tasks.map(t=>t.id===id?task:t):[...w.tasks,task]}
}
export function reviewStaffTask(w:Workspace,id:string):Workspace {
  const task=w.tasks.find(t=>t.id===id)
  if(!task||task.status!=='Completed')throw new Error('Only completed tasks can be reviewed.')
  return {...w,tasks:w.tasks.map(t=>t.id===id?{...t,reviewedAt:today()}:t)}
}
export function staffPerformance(w:Workspace,id:string,asOf=today()) {
  const tasks=w.tasks.filter(t=>t.staffId===id)
  const completed=tasks.filter(t=>t.status==='Completed')
  return {total:tasks.length,completed:completed.length,overdue:tasks.filter(t=>t.status!=='Completed'&&t.due<asOf).length,late:completed.filter(t=>t.completedAt&&t.completedAt>t.due).length,unknownCompletionDate:completed.filter(t=>!t.completedAt).length,reviewed:completed.filter(t=>t.reviewedAt).length,rate:tasks.length?Math.round(completed.length/tasks.length*100):0}
}
