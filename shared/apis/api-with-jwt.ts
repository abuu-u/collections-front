import axios from 'axios'
import { COMMON_HEADERS } from '../constants/headers'
import { BASE_URL } from '../constants/urls'
import { getToken } from '../localstorage/token'

const apiWithJwt = axios.create({
  baseURL: BASE_URL,
  headers: COMMON_HEADERS,
})

apiWithJwt.interceptors.request.use((config) => {
  const token = getToken()

  if (config!.headers!.Authorization) {
    config!.headers!.Authorization = `Bearer ${token || ''}`
  }

  return config
})

export { apiWithJwt }
