import { localstorageKeys } from '../constants/localstorage-keys'

export const setName = (name: string) =>
  localStorage.setItem(localstorageKeys.NAME, name)

export const getName = () =>
  typeof window !== 'undefined'
    ? localStorage.getItem(localstorageKeys.NAME) ?? undefined
    : undefined

export const removeName = () => localStorage.removeItem(localstorageKeys.NAME)
