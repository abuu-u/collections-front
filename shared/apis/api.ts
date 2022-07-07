import axios from 'axios'
import { COMMON_HEADERS } from '../constants/headers'
import { BASE_URL } from '../constants/urls'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: COMMON_HEADERS,
})
