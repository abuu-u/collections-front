import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useRouter } from 'next/router'
import { ComponentType } from 'react'
import { setLocale } from '../../shared/cookie/locale'

interface Properties {}

const LocaleSelect: ComponentType<Properties> = () => {
  const router = useRouter()
  const { locale, locales, asPath, pathname, query } = router

  const handleChange = (event_: SelectChangeEvent<string>) => {
    const nextLocale = event_.target.value
    setLocale(nextLocale)
    router.push({ pathname, query }, asPath, { locale: nextLocale })
  }

  return (
    <Select value={locale} onChange={handleChange}>
      {locales?.map((it) => (
        <MenuItem key={it} value={it}>
          {it}
        </MenuItem>
      ))}
    </Select>
  )
}

export default LocaleSelect
