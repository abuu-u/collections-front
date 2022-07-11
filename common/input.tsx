import TextField, { TextFieldProps } from '@mui/material/TextField'
import { forwardRef } from 'react'
import { useIntl } from 'react-intl'

type Properties = Omit<TextFieldProps, 'error'> & {
  error?: string
}

const Input = forwardRef<HTMLDivElement, Properties>(
  ({ label, error, ...rest }, reference) => {
    const intl = useIntl()

    return (
      <TextField
        ref={reference}
        error={!!error}
        label={label}
        helperText={error ? intl.formatMessage({ id: error }) : undefined}
        {...rest}
      />
    )
  },
)

Input.displayName = 'Input'

export default Input
