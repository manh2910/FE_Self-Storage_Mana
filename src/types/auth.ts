export type UserRole =
  | 'StorageCustomer'
  | 'FacilityStaff'
  | 'FacilityManager'
  | 'BusinessOperationsManager'
  | 'SystemAdministrator'

export interface User {
  userId: number
  fullName: string
  email: string
  phoneNumber?: string
  role: UserRole
  status: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
  user: {
    userId: number
    fullName: string
    email: string
    phoneNumber?: string
    roleCode: string
    roleName: string
    status: string
  }
}
