import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import SiteHeader from './components/layout/SiteHeader'
import HomePage from './pages/Home/HomePage'
import CustomerDashboard from './pages/Customer/CustomerDashboard'
import StaffDashboard from './pages/Staff/StaffDashboard'
import ManagerDashboard from './pages/Manager/ManagerDashboard'
import StorageUnitsPage from './pages/Manager/StorageUnitsPage'
import FacilityWorkspacePage from './pages/Manager/FacilityWorkspacePages'
import OperationsDashboard from './pages/Operations/OperationsDashboard'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ProtectedRoute from './components/common/ProtectedRoute'
import PublicStorageLayout from './features/discovery/PublicStorageLayout'
import { FacilitiesPage, FacilityDetailsPage, StorageUnitDetailsPage, PricingSizeGuidePage, HowItWorksPage } from './features/discovery/DiscoveryPages'
import { BookingCheckoutPage, BookingConfirmationPage, CustomerBookingsPage, CustomerPaymentsPage } from './features/booking/BookingPages'

// Shared interaction feedback uses Tailwind; page-specific colors stay in each component.
const interactions = [
  'contents',
  '[&_:is(a,button,summary)]:transition-[color,background-color,border-color,box-shadow,opacity,filter,translate]',
  '[&_:is(a,button,summary)]:duration-200 [&_:is(a,button,summary)]:ease-out',
  '[&_button:enabled]:cursor-pointer [&_button:disabled]:cursor-not-allowed',
  '[&_:is(a,button,summary):focus-visible]:!outline-2',
  '[&_:is(a,button,summary):focus-visible]:!outline-blue-500',
  '[&_:is(a,button,summary):focus-visible]:!outline-offset-4',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_button:enabled:hover]:[filter:brightness(.96)]',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_button:enabled:hover]:[translate:0_-2px]',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_button:enabled:hover]:shadow-md',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_a:not([aria-disabled=true]):hover]:[filter:brightness(.94)]',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_a[class*=button]:not([aria-disabled=true]):hover]:[translate:0_-2px]',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_a[class*=button]:not([aria-disabled=true]):hover]:shadow-md',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_summary:hover]:text-blue-600',
  '[&_:is(.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card):is(a,:has(a,button))]:transition-[box-shadow,border-color,translate]',
  '[&_:is(.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card):is(a,:has(a,button))]:duration-200',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_:is(.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card):is(a,:has(a,button)):hover]:[translate:0_-4px]',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_:is(.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card):is(a,:has(a,button)):hover]:!border-blue-300',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_:is(.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card):is(a,:has(a,button)):hover]:!shadow-lg',
  '[&_:is(.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card):focus-within]:ring-2',
  '[&_:is(.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card):focus-within]:ring-blue-200',
  '[&_tbody_tr]:transition-colors [&_tbody_tr]:duration-150',
  '[@media(hover:hover)_and_(pointer:fine)]:[&_tbody_tr:hover]:bg-blue-50/60',
  'motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:![translate:none]',
].join(' ')

function App() {
  return (
    <div className={interactions}>
    <SiteHeader />
    <Routes>
      {/* Home công khai - Hiển thị mặc định khi truy cập ứng dụng (/) */}
      <Route path="/" element={<HomePage />} />
      <Route element={<PublicStorageLayout />}>
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/facilities/:facilityId" element={<FacilityDetailsPage />} />
        <Route path="/storage/:unitId" element={<StorageUnitDetailsPage />} />
        <Route path="/pricing" element={<PricingSizeGuidePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/faq" element={<Navigate to="/how-it-works#faq" replace />} />
        <Route path="/storage" element={<CustomerDashboard />} />
        <Route path="/booking" element={<CustomerDashboard />} />
      </Route>

      {/* Authentication is optional; public and manager preview routes remain accessible. */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Portal (Sử dụng CustomerLayout không có 's' ở layout) */}
      <Route
        path="/customer/*"
        element={
          <PublicStorageLayout />
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="book/:unitId" element={<BookingCheckoutPage />} />
        <Route path="bookings/:bookingId" element={<BookingConfirmationPage />} />
        <Route path="browse" element={<CustomerDashboard />} />
        <Route path="units" element={<CustomerBookingsPage />} />
        <Route path="payments" element={<CustomerPaymentsPage />} />
        <Route path="support" element={<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><h2 className="text-xl font-bold text-slate-900">Request support</h2><p className="text-slate-500 mt-2 text-sm">Support requests are under development. Call 0909 149 563 for assistance.</p></div>} />
      </Route>

      {/* Staff Portal */}
      <Route
        path="/staff/*"
        element={
          <ProtectedRoute allowedRoles={['FacilityStaff']}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* Temporary FM interface preview; restore role protection with authentication. */}
      <Route path="/manager/payments" element={<FacilityWorkspacePage mode="payments" />} />
      <Route path="/manager/support" element={<FacilityWorkspacePage mode="support" />} />
      <Route path="/manager/units" element={<StorageUnitsPage />} />
      <Route path="/manager/assign" element={<FacilityWorkspacePage mode="assign" />} />
      <Route path="/manager/rentals" element={<FacilityWorkspacePage mode="rentals" />} />
      <Route path="/manager/operations" element={<FacilityWorkspacePage mode="operations" />} />
      <Route path="/manager/staff" element={<FacilityWorkspacePage mode="staff" />} />
      <Route path="/manager/reports" element={<FacilityWorkspacePage mode="reports" />} />

      <Route
        path="/manager/*"
        element={<ManagerDashboard />}
      />

      {/* Operations Portal */}
      <Route
        path="/operations/*"
        element={
          <ProtectedRoute allowedRoles={['BusinessOperationsManager']}>
            <OperationsDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Portal */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['SystemAdministrator']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Các đường dẫn không hợp lệ sẽ tự động điều hướng về Home Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </div>
  )
}

export default App

