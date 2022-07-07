import Cookies from 'js-cookie'
import { cookie } from '../constants/cookie-keys'

export const setLocale = (locale: string) => {
  Cookies.set(cookie.NEXT_LOCALE, locale, {
    expires: 365,
  })
}
