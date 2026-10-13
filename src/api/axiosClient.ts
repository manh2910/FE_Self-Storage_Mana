import axios from 'axios'

const axiosClient = axios.create({
  // Sử dụng '/api' để tận dụng Vite Proxy (tránh lỗi SSL certificate & CORS trên trình duyệt)
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Tự động đính kèm JWT Token vào Header nếu đã đăng nhập
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token === 'demo-session') {
      return Promise.reject(new Error('Preview sessions cannot call live APIs. Sign out of preview mode before using a real account.'))
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Xử lý tự động khi token hết hạn hoặc lỗi 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosClient
