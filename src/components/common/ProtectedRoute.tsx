import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, hasRole } from '../../hooks/useAuth'
import type { UserRole } from '../../types/auth'

interface Props {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  if (!hasRole(user, allowedRoles)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
