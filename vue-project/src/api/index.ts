  import axios from 'axios'

  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'

  export const axiosInstance = axios.create({
    baseURL: apiBase,
    timeout: 10000,
  })