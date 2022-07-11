import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { NextLinkComposed } from 'common/link'
import { logout, selectName } from 'features/auth/auth-slice'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { routes } from 'shared/constants/routes'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'
import CustomAvatar from './custom-avatar'

const UserMenu = () => {
  const dispatch = useAppDispatch()

  const name = useAppSelector(selectName)

  const [anchorElement, setAnchorElement] = useState<HTMLElement>()

  const intl = useIntl()

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleClose = () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    setAnchorElement(undefined)
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      <IconButton size="large" onClick={handleMenu}>
        <CustomAvatar name={name} />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!anchorElement}
        onClose={handleClose}
      >
        {name
          ? [
              <MenuItem
                key="my-collections"
                component={NextLinkComposed}
                to={routes.MY_COLLECTIONS}
              >
                {intl.formatMessage({ id: 'user-menu.my-collections' })}
              </MenuItem>,
              <MenuItem key="logout" onClick={handleLogout}>
                {intl.formatMessage({ id: 'user-menu.logout' })}
              </MenuItem>,
            ]
          : [
              <MenuItem
                key="login"
                component={NextLinkComposed}
                to={routes.LOGIN}
              >
                {intl.formatMessage({ id: 'user-menu.login' })}
              </MenuItem>,
              <MenuItem
                key="register"
                component={NextLinkComposed}
                to={routes.REGISTER}
              >
                {intl.formatMessage({ id: 'user-menu.register' })}
              </MenuItem>,
            ]}
      </Menu>
    </>
  )
}

export default UserMenu
