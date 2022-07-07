import Avatar from '@mui/material/Avatar'

const stringToColor = (string: string) => {
  let hash = 0
  let index

  for (index = 0; index < string.length; index += 1) {
    hash = string.codePointAt(index)! + ((hash << 5) - hash)
  }

  let color = '#'

  for (index = 0; index < 3; index += 1) {
    const value = (hash >> (index * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0][0]}`,
  }
}

interface Properties {
  name?: string
}

const CustomAvatar: React.ComponentType<Properties> = ({ name }) => {
  return name ? <Avatar {...stringAvatar(name)} /> : <Avatar>?</Avatar>
}

export default CustomAvatar
