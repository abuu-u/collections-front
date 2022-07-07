import TextField, { TextFieldProps } from '@mui/material/TextField'
import { forwardRef } from 'react'

type Properties = Omit<TextFieldProps, 'error'> & {
  error?: string
}

const Input = forwardRef<HTMLDivElement, Properties>(
  ({ label, error, ...rest }, reference) => {
    return (
      <TextField
        ref={reference}
        error={!!error}
        label={label}
        helperText={error}
        {...rest}
      />
    )
  },
)

Input.displayName = 'Input'

export default Input
