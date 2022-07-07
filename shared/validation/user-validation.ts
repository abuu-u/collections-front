import * as yup from 'yup'

const requiredText = 'Field is required'
const emailText = 'Incorrect email address'

export const loginSchema = yup.object().shape({
  email: yup.string().email(emailText).required(requiredText),
  password: yup.string().min(1, requiredText).required(requiredText),
})

export const registerSchema = loginSchema.shape({
  name: yup.string().min(1, requiredText).required(requiredText),
})
