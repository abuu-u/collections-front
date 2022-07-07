import { urls } from '../constants/urls'
import { api } from './api'
import { apiWithJwt } from './api-with-jwt'

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface GetUsersRequest {
  page: number
  count: number
}

export interface ModifyUsersRequest {
  ids: number[]
}

export interface AuthenticationResponse {
  name: string
  jwtToken: string
}

export interface UserData {
  id: number
  name: string
  email: string
  status: boolean
  admin: boolean
}

export interface GetUsersResponse {
  pagesCount: number
  users: UserData[]
}

export const registerUser = async (data: RegisterRequest) => {
  const response = await api.post<AuthenticationResponse>(
    `${urls.USERS}/register`,
    data,
  )
  return response
}

export const loginUser = async (data: LoginRequest) => {
  const response = await api.post<AuthenticationResponse>(
    `${urls.USERS}/login`,
    data,
  )
  return response
}

export const getUsers = async (parameters: GetUsersRequest) => {
  const response = await apiWithJwt.get<GetUsersResponse>(urls.USERS, {
    params: parameters,
  })
  return response
}

export const blockUsers = async (data: ModifyUsersRequest) => {
  const response = await apiWithJwt.put(`${urls.USERS}/block`, data.ids)
  return response
}

export const unBlockUsers = async (data: ModifyUsersRequest) => {
  const response = await apiWithJwt.put(`${urls.USERS}/unblock`, data.ids)
  return response
}

export const deleteUsers = async (data: ModifyUsersRequest) => {
  const response = await apiWithJwt.delete(urls.USERS, { data: data.ids })
  return response
}

export const promoteUsers = async (data: ModifyUsersRequest) => {
  const response = await apiWithJwt.put(`${urls.USERS}/promote`, data.ids)
  return response
}

export const demoteUsers = async (data: ModifyUsersRequest) => {
  const response = await apiWithJwt.put(`${urls.USERS}/demote`, data.ids)
  return response
}
