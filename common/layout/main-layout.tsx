import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import { PropsWithChildren, useEffect, useState } from 'react'
import UserMenu from '../../features/auth/user-menu'
import LocaleSelect from '../../features/locale/locale-select'
import ThemeChangeIcon from '../../features/theme/theme-change-icon'

const MainLayout: React.ComponentType<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <AppBar position="static">
        <Container>
          <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {isClient && <LocaleSelect />}

            {isClient && <ThemeChangeIcon />}

            {isClient && <UserMenu />}
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ mt: '20px' }}>{children}</Container>
    </>
  )
}

export default MainLayout
