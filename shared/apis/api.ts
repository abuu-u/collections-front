import axios, { AxiosError } from 'axios'
import { COMMON_HEADERS } from 'shared/constants/headers'
import { BASE_URL } from 'shared/constants/urls'
import { ErrorResponseClass } from './error-response'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: COMMON_HEADERS,
})

api.interceptors.response.use(
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
