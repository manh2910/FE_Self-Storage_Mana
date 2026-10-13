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

function App() {
  return (
    <>
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

      {/* Authentication is temporarily disabled while previewing the two interfaces. */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />

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
    </>
  )
}

export default App

