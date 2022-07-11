import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  email: yup.string().email('validation.email').required('validation.required'),
  password: yup
    .string()
    .min(1, 'validation.required')
    .required('validation.required'),
})

export const registerSchema = loginSchema.shape({
  name: yup
    .string()
    .min(1, 'validation.required')
    .required('validation.required'),
})
