import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import { Breakpoint } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { NextLinkComposed } from 'common/link'
import UserMenu from 'features/auth/user-menu'
import LocaleSelect from 'features/locale/locale-select'
import Search from 'features/search/search'
import ThemeChangeIcon from 'features/theme/theme-change-icon'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { routes } from 'shared/constants/routes'

interface Properties {
  maxWidth?: Breakpoint
}

const MainLayout: React.ComponentType<PropsWithChildren<Properties>> = ({
  children,
  maxWidth,
}) => {
  const [isClient, setIsClient] = useState(false)

  const intl = useIntl()

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
          >
            <Typography
              variant="h6"
              noWrap
              component={NextLinkComposed}
              to={routes.HOME}
              sx={{
                mr: 'auto',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {intl.formatMessage({ id: 'navigation.home' })}
            </Typography>

            {isClient && <Search />}

            {isClient && <LocaleSelect />}

            {isClient && <ThemeChangeIcon />}

            {isClient && <UserMenu />}
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ my: '20px' }} maxWidth={maxWidth}>
        {children}
      </Container>
    </>
  )
}

export default MainLayout
