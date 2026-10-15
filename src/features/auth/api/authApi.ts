import axiosClient from '../../../shared/api/axiosClient'
import type { LoginRequest, LoginResponse, User } from '../types/auth'

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await axiosClient.post('/auth/login', data)
    return res.data
  },

  register: async (data: {
    fullName: string
    email: string
    password: string
    phoneNumber?: string
  }): Promise<{ message: string; user: User }> => {
    const res = await axiosClient.post('/auth/register', data)
    return res.data
  },
}
