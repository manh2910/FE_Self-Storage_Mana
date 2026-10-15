import { DemoBookingStore, type Booking } from '../../booking/model/domain'
import { storageUnits } from '../../booking/model/catalog'
import type { Workspace } from './facilityWorkspace'
export interface BookingStorage { readonly length: number; key(index:number):string|null; getItem(key:string):string|null; setItem(key:string,value:string):void }
export interface IncomingBooking { booking:Booking; unitName:string; receivedAt?:string }
export function incomingBookings(storage:BookingStorage,w:Workspace):IncomingBooking[] {
  const store=new DemoBookingStore(storage)
  const result:IncomingBooking[]=[]
  for(let index=0;index<storage.length;index++){
    const key=storage.key(index)
    const match=key?.match(/^selfstorage:demo-bookings:v1:(\d+)$/)
    if(!match)continue
    const userId=Number(match[1])
    for(const booking of store.list(userId)){
      const unit=storageUnits.find(u=>u.id===booking.unitId&&u.location==='district-1')
      if(!unit)continue
      const receivedAt=w.bookingHandovers?.find(h=>h.userId===userId&&h.bookingId===booking.id)?.receivedAt
      if(booking.status==='cancelled'&&!receivedAt)continue
      result.push({booking,unitName:unit.name,receivedAt})
    }
  }
  return result.sort((a,b)=>a.booking.startDate.localeCompare(b.booking.startDate)||b.booking.createdAt.localeCompare(a.booking.createdAt))
}
export function receiveBooking(w:Workspace,storage:BookingStorage,userId:number,bookingId:string):Workspace {
  const item=incomingBookings(storage,w).find(row=>row.booking.userId===userId&&row.booking.id===bookingId)
  if(!item||item.booking.status==='cancelled')throw new Error('This booking is no longer available for handover. Refresh the list.')
  if(item.receivedAt)throw new Error('This booking has already been handed over.')
  return {...w,bookingHandovers:[...(w.bookingHandovers||[]),{bookingId,userId,receivedAt:new Date().toISOString()}]}
}
