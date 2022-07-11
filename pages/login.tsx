import { yupResolver } from '@hookform/resolvers/yup'
import Input from 'common/input'
import AuthForm from 'features/auth/auth-form'
import { login } from 'features/auth/auth-slice'
import { loginSchema } from 'features/auth/user-validation'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { LoginRequest } from 'shared/apis/users-api'
import { useAppDispatch } from 'shared/lib/store'

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  })

  const dispatch = useAppDispatch()

  const intl = useIntl()

  const handleFormSubmit = (data: LoginRequest) => {
    dispatch(login(data))
  }

  return (
    <AuthForm
      formName={intl.formatMessage({ id: 'auth.login' })}
      onSubmit={handleSubmit((data) => handleFormSubmit(data))}
    >
      <Input
        label="Email"
        error={errors.email?.message}
        fullWidth
        {...register('email')}
      />

      <Input
        label="Password"
        error={errors.password?.message}
        fullWidth
        type="password"
        {...register('password')}
      />
    </AuthForm>
  )
}

export default Login
