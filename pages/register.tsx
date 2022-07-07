import { yupResolver } from '@hookform/resolvers/yup'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import Input from '../common/input'
import AuthForm from '../features/auth/auth-form'
import { register as registerUser } from '../features/auth/auth-slice'
import { RegisterRequest } from '../shared/apis/users-api'
import { useAppDispatch } from '../shared/lib/store'
import { registerSchema } from '../shared/validation/user-validation'

const Register: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(registerSchema),
  })

  const dispatch = useAppDispatch()

  const handleFormSubmit = (data: RegisterRequest) => {
    dispatch(registerUser(data))
  }

  return (
    <AuthForm
      formName="Register"
      onSubmit={handleSubmit((data) => handleFormSubmit(data))}
    >
      <Input
        label="Name"
        error={errors.name?.message}
        fullWidth
        {...register('name')}
      />

      <Input
        label="Email"
        error={errors.email?.message}
        fullWidth
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        fullWidth
        {...register('password')}
      />
    </AuthForm>
  )
}

export default Register
