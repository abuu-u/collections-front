import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'
import { ComponentType } from 'react'

interface Properties {}

const ThemeChangeIcon: ComponentType<Properties> = () => {
  const { mode, setMode } = useColorScheme()

  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      color="inherit"
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  )
}

export default ThemeChangeIcon
