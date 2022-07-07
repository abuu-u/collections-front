import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { red } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import {
  ComponentType,
  FormEventHandler,
  PropsWithChildren,
  useEffect,
} from 'react'
import MainLayout from '../../common/layout/main-layout'
import { routes } from '../../shared/constants/routes'
import { useAppDispatch, useAppSelector } from '../../shared/lib/store'
import {
  reset,
  selectAuthError,
  selectAuthStatus,
  selectName,
} from './auth-slice'

interface Properties {
  onSubmit: FormEventHandler | undefined
  formName: string
}

const AuthForm: ComponentType<PropsWithChildren<Properties>> = ({
  onSubmit,
  formName,
  children,
}) => {
  const dispatch = useAppDispatch()

  const status = useAppSelector(selectAuthStatus)
  const name = useAppSelector(selectName)
  const error = useAppSelector(selectAuthError)

  const router = useRouter()

  useEffect(() => {
    if (name !== undefined) {
      router.push(routes.HOME)
    }
  }, [name, router])

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainLayout>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={status === 'loading'}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 300,
          m: 'auto',
        }}
        onSubmit={onSubmit}
      >
        <Typography component="h1" variant="h4" textAlign="center" mb="20px">
          {formName}
        </Typography>

        {status === 'failed' && (
          <Typography
            color="white"
            variant="body1"
            mb="20px"
            width="100%"
            padding="10px"
            bgcolor={red[300]}
          >
            {error}
          </Typography>
        )}

        <Box component="form" sx={{ display: 'grid', gap: '15px' }}>
          {children}

          <Button type="submit" variant="contained" fullWidth>
            {formName}
          </Button>
        </Box>
      </Box>
    </MainLayout>
  )
}

export default AuthForm
