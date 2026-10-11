import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import CustomerLayout from './components/layout/CustomerLayout'
import CustomerDashboard from './pages/Customer/CustomerDashboard'
import StaffDashboard from './pages/Staff/StaffDashboard'
import ManagerDashboard from './pages/Manager/ManagerDashboard'
import OperationsDashboard from './pages/Operations/OperationsDashboard'
import AdminDashboard from './pages/Admin/AdminDashboard'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Trang chủ công khai - Hiển thị mặc định khi truy cập ứng dụng (/) */}
      <Route path="/" element={<HomePage />} />

      {/* Các trang xác thực */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Portal (Sử dụng CustomerLayout không có 's' ở layout) */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute allowedRoles={['StorageCustomer']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerDashboard />} />
        <Route path="browse" element={<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><h2 className="text-xl font-bold text-slate-900">Tìm & Đặt chỗ kho</h2><p className="text-slate-500 mt-2 text-sm">Tính năng đang phát triển theo Flow 1.</p></div>} />
        <Route path="units" element={<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><h2 className="text-xl font-bold text-slate-900">Kho đang thuê của tôi</h2><p className="text-slate-500 mt-2 text-sm">Tính năng đang phát triển theo Flow 3 & 6.</p></div>} />
        <Route path="payments" element={<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><h2 className="text-xl font-bold text-slate-900">Lịch sử thanh toán</h2><p className="text-slate-500 mt-2 text-sm">Tính năng đang phát triển theo Flow 4.</p></div>} />
        <Route path="support" element={<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"><h2 className="text-xl font-bold text-slate-900">Yêu cầu hỗ trợ</h2><p className="text-slate-500 mt-2 text-sm">Tính năng đang phát triển theo Flow 7.</p></div>} />
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

      {/* Manager Portal */}
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute allowedRoles={['FacilityManager']}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
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
  )
}

export default App