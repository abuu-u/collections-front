import {
  createAsyncThunk,
  createSlice,
  isPending,
  PayloadAction,
} from '@reduxjs/toolkit'
import { ErrorResponse } from 'shared/apis/error-response'
import {
  deleteUsers,
  DeleteUsersRequest,
  getUsers,
  GetUsersRequest,
  GetUsersResponse,
  ModificationType,
  modifyUsers,
  ModifyUsersRequest,
} from 'shared/apis/users-api'
import {
  isFulfilledAction,
  isRejectedAction,
  RootState,
} from 'shared/lib/store'

export interface AdminState {
  currentPage: number
  usersFetchCount: number
  data: GetUsersResponse
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: ErrorResponse
}

export const DEFAULT_USERS_CURRENT_PAGE = 1
export const DEFAULT_USERS_FETCH_COUNT = 10

const initialState: AdminState = {
  currentPage: DEFAULT_USERS_CURRENT_PAGE,
  usersFetchCount: DEFAULT_USERS_FETCH_COUNT,
  data: {
    usersCount: 0,
    pagesCount: 0,
    users: [],
  },
  status: 'idle',
}

export const getAllUsers = createAsyncThunk<
  GetUsersResponse,
  Partial<GetUsersRequest> | undefined,
  { rejectValue: ErrorResponse }
>('admin/getAllUsers', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await getUsers({
      count: data?.count ?? DEFAULT_USERS_FETCH_COUNT,
      page: data?.page ?? DEFAULT_USERS_CURRENT_PAGE,
    })
    if (data?.page) {
      dispatch(adminSlice.actions.setCurrentPage(data.page))
    }
    if (data?.count) {
      dispatch(adminSlice.actions.setUsersFetchCount(data.count))
    }
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const deleteSelectedUsers = createAsyncThunk<
  GetUsersResponse,
  DeleteUsersRequest,
  { rejectValue: ErrorResponse; state: RootState }
>('admin/deleteSelectedUsers', async (data, { rejectWithValue, getState }) => {
  const { currentPage, usersFetchCount } = getState().admin
  try {
    await deleteUsers(data)
    const response = await getUsers({
      count: usersFetchCount,
      page: currentPage,
    })
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

const createModifyUsers = (modification: ModificationType) =>
  createAsyncThunk<
    GetUsersResponse,
    Omit<ModifyUsersRequest, 'modification'>,
    { rejectValue: ErrorResponse; state: RootState }
  >(
    `admin/${modification}AllUsers`,
    async (data, { rejectWithValue, getState }) => {
      const { currentPage, usersFetchCount } = getState().admin
      try {
        await modifyUsers({ ...data, modification })
        const response = await getUsers({
          count: usersFetchCount,
          page: currentPage,
        })
        return response.data
      } catch (error) {
        return rejectWithValue({ ...(error as Object) } as ErrorResponse)
      }
    },
  )

export const blockUsers = createModifyUsers('block')

export const unblockUsers = createModifyUsers('unblock')

export const promoteUsers = createModifyUsers('promote')

export const demoteUsers = createModifyUsers('demote')

export const adminSlice = createSlice({
  name: 'admin',

  initialState,

  reducers: {
    reset: () => initialState,

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },

    setUsersFetchCount: (state, action: PayloadAction<number>) => {
      state.usersFetchCount = action.payload
    },
  },

  extraReducers(builder) {
    builder
      .addMatcher(isPending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addMatcher(
        isFulfilledAction<GetUsersResponse>('admin/'),
        (state, action) => {
          state.status = 'succeeded'
          state.data = action.payload
        },
      )
      .addMatcher(
        isRejectedAction<ErrorResponse>('admin/'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload
        },
      )
  },
})

export const { reset } = adminSlice.actions

export const selectAdminStatus = (state: RootState) => state.admin.status
export const selectAdminError = (state: RootState) => state.admin.error
export const selectCurrenPage = (state: RootState) => state.admin.currentPage
export const selectUsersCount = (state: RootState) =>
  state.admin.data.usersCount
export const selectUsers = (state: RootState) => state.admin.data.users
export const selectPagesCount = (state: RootState) =>
  state.admin.data.pagesCount

const adminReducer = adminSlice.reducer

export default adminReducer
