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

export type ModificationType = 'block' | 'unblock' | 'promote' | 'demote'

export interface ModifyUsersRequest {
  modification: ModificationType
  ids: number[]
}

export interface DeleteUsersRequest {
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
  usersCount: number
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

export const modifyUsers = async (data: ModifyUsersRequest) => {
  const response = await apiWithJwt.put(
    `${urls.USERS}/${data.modification}`,
    data.ids,
  )
  return response
}

export const deleteUsers = async (data: DeleteUsersRequest) => {
  const response = await apiWithJwt.delete(urls.USERS, { data: data.ids })
  return response
}
