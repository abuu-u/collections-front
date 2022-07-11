import { localstorageKeys } from 'shared/constants/localstorage-keys'

export const setToken = (token: string) => {
  localStorage.setItem(localstorageKeys.TOKEN, token)
}

export const getToken = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem(localstorageKeys.TOKEN) ?? undefined
    : undefined

export const removeToken = () => {
  localStorage.removeItem(localstorageKeys.TOKEN)
}
