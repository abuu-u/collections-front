import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosErrorResponse } from '../../shared/apis/error-response'
import {
  AuthenticationResponse,
  LoginRequest,
  loginUser,
  RegisterRequest,
  registerUser,
} from '../../shared/apis/users-api'
import { RootState } from '../../shared/lib/store'
import { getName, removeName, setName } from '../../shared/localstorage/name'
import { removeToken, setToken } from '../../shared/localstorage/token'

export interface AuthState {
  name?: string
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: AuthState = {
  name: getName(),
  status: 'idle',
}

export const login = createAsyncThunk<
  AuthenticationResponse,
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUser(data)
    setName(response.data.name)
    setToken(response.data.jwtToken)
    return response.data
  } catch (error) {
    return rejectWithValue((error as AxiosErrorResponse).response.data.message)
  }
})

export const register = createAsyncThunk<
  AuthenticationResponse,
  RegisterRequest,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUser(data)
    setName(response.data.name)
    setToken(response.data.jwtToken)
    return response.data
  } catch (error) {
    return rejectWithValue((error as AxiosErrorResponse).response.data.message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  removeName()
  removeToken()
})

export const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    reset: (state) => {
      state.status = 'idle'
      state.error = undefined
    },
  },

  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.name = action.payload.name
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.name = action.payload.name
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      .addCase(logout.fulfilled, (state) => {
        state.error = undefined
        state.name = undefined
        state.status = 'idle'
      })
  },
})

export const { reset } = authSlice.actions

export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthError = (state: RootState) => state.auth.error
export const selectName = (state: RootState) => state.auth.name

const authReducer = authSlice.reducer

export default authReducer
