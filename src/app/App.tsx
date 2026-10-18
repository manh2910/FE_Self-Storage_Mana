import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import SiteHeader from '../shared/layout/SiteHeader'
import HomePage from '../features/home/pages/HomePage'
import CustomerDashboard from '../features/customer/pages/CustomerDashboard'
import StaffDashboard from '../features/staff/pages/StaffDashboard'
import ManagerDashboard from '../features/manager/pages/ManagerDashboard'
import StorageUnitsPage from '../features/manager/pages/StorageUnitsPage'
import FacilityWorkspacePage from '../features/manager/pages/FacilityWorkspacePages'
import OperationsDashboard from '../features/operations/pages/OperationsDashboard'
import AdminDashboard from '../features/admin/pages/AdminDashboard'
import ProtectedRoute from '../features/auth/components/ProtectedRoute'
import PublicStorageLayout from '../features/discovery/components/PublicStorageLayout'
import { FacilitiesPage, FacilityDetailsPage, StorageUnitDetailsPage, PricingSizeGuidePage, HowItWorksPage } from '../features/discovery/pages/DiscoveryPages'
import { BookingCheckoutPage, BookingConfirmationPage, CustomerBookingsPage, CustomerPaymentsPage } from '../features/booking/pages/BookingPages'

const interactions = [
  'contents',
  '[&_a,button,summary]:transition-colors [&_a,button,summary]:duration-200',
  '[&_button:enabled]:cursor-pointer [&_button:disabled]:cursor-not-allowed',
  '[&_a,button,summary]:focus-visible:outline-2 [&_a,button,summary]:focus-visible:outline-blue-500 [&_a,button,summary]:focus-visible:outline-offset-4',
  'hover:[&_button:enabled]:brightness-95 hover:[&_button:enabled]:-translate-y-0.5 hover:[&_button:enabled]:shadow-md',
  'hover:[&_a:not([aria-disabled=true])]:brightness-95',
  'hover:[&_.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card]:-translate-y-1',
  'hover:[&_.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card]:border-blue-300',
  'hover:[&_.size-card,.facility-card,.cb-card,.ds-card,.fm-function,.booking-unit-card]:shadow-lg',
  '[&_tbody_tr]:transition-colors hover:[&_tbody_tr]:bg-blue-50/60',
  'motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!translate-none',
].join(' ')

function App() {
  return (
    <div className={interactions}>
      <SiteHeader />
      <Routes>
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

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/customer/*" element={<PublicStorageLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="book/:unitId" element={<BookingCheckoutPage />} />
          <Route path="bookings/:bookingId" element={<BookingConfirmationPage />} />
          <Route path="browse" element={<CustomerDashboard />} />
          <Route path="units" element={<CustomerBookingsPage />} />
          <Route path="payments" element={<CustomerPaymentsPage />} />
          <Route
            path="support"
            element={
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Request support</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Support requests are under development. Call 0909 149 563 for assistance.
                </p>
              </div>
            }
          />
        </Route>


      {/* Staff Portal */}
      <Route
        path="/staff/*"
        element={<StaffDashboard />}
      />

        <Route
          path="/staff/*"
          element={
            <ProtectedRoute allowedRoles={['FacilityStaff']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />


        <Route path="/manager/payments" element={<FacilityWorkspacePage mode="payments" />} />
        <Route path="/manager/support" element={<FacilityWorkspacePage mode="support" />} />
        <Route path="/manager/units" element={<StorageUnitsPage />} />
        <Route path="/manager/assign" element={<FacilityWorkspacePage mode="assign" />} />
        <Route path="/manager/rentals" element={<FacilityWorkspacePage mode="rentals" />} />
        <Route path="/manager/operations" element={<FacilityWorkspacePage mode="operations" />} />
        <Route path="/manager/staff" element={<FacilityWorkspacePage mode="staff" />} />
        <Route path="/manager/reports" element={<FacilityWorkspacePage mode="reports" />} />
        <Route path="/manager/*" element={<ManagerDashboard />} />

        <Route
          path="/operations/*"
          element={
            <ProtectedRoute allowedRoles={['BusinessOperationsManager']}>
              <OperationsDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['SystemAdministrator']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App