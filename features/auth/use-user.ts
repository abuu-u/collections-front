import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { routes } from 'shared/constants/routes'
import { useAppSelector } from 'shared/lib/store'
import { selectName } from './auth-slice'

export const useUser = () => {
  const router = useRouter()
  const name = useAppSelector(selectName)

  useEffect(() => {
    if (!name) {
      router.push(routes.LOGIN)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])
}
