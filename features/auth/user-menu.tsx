import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { NextLinkComposed } from '../../common/link'
import { logout, selectName } from '../../features/auth/auth-slice'
import { routes } from '../../shared/constants/routes'
import { useAppDispatch, useAppSelector } from '../../shared/lib/store'
import CustomAvatar from './custom-avatar'

const UserMenu = () => {
  const dispatch = useAppDispatch()

  const name = useAppSelector(selectName)

  const [anchorElement, setAnchorElement] = useState<HTMLElement>()

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
        {name ? (
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        ) : (
          [
            <MenuItem
              key="login"
              component={NextLinkComposed}
              to={routes.LOGIN}
            >
              Login
            </MenuItem>,
            <MenuItem
              key="register"
              component={NextLinkComposed}
              to={routes.REGISTER}
            >
              Register
            </MenuItem>,
          ]
        )}
      </Menu>
    </>
  )
}

export default UserMenu
