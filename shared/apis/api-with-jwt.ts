import axios, { AxiosError } from 'axios'
import { COMMON_HEADERS } from 'shared/constants/headers'
import { BASE_URL } from 'shared/constants/urls'
import { getToken } from 'shared/localstorage/token'
import { ErrorResponseClass } from './error-response'

const apiWithJwt = axios.create({
  baseURL: BASE_URL,
  headers: COMMON_HEADERS,
})

apiWithJwt.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>
      if (!axiosError.response) {
        throw new Error('unexpected error')
      }
      throw new ErrorResponseClass({
        message: axiosError.response.data.message,
        status: axiosError.response.status,
      })
    }
  },
)

apiWithJwt.interceptors.request.use((config) => {
  const token = getToken()
  if (!config!.headers!.Authorization && !!token) {
    config!.headers!.Authorization = `Bearer ${token}`
  }
  return config
})

export { apiWithJwt }
