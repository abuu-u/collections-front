import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ErrorResponse } from 'shared/apis/error-response'
import {
  createComment,
  CreateCommentRequest,
  CreateCommentResponse,
  getComments,
  GetCommentsResponse,
  getItem,
  GetItemResponse,
  like,
  unlike,
} from 'shared/apis/items-api'
import {
  AppDispatch,
  isFulfilledAction,
  isPendingAction,
  isRejectedAction,
  RootState,
} from 'shared/lib/store'

export interface ItemsState {
  data: Omit<GetItemResponse, 'comments'>
  comments: GetItemResponse['comments']
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: ErrorResponse
}

const initialState: ItemsState = {
  data: {
    name: '',
    tags: [],
    likesCount: 0,
    like: false,
    fields: [],
    intValues: [],
    boolValues: [],
    stringValues: [],
    dateTimeValues: [],
  },
  comments: [],
  status: 'idle',
}

export const getItemById = createAsyncThunk<
  GetItemResponse,
  number,
  { rejectValue: ErrorResponse }
>('items/getItemById', async (id, { rejectWithValue }) => {
  try {
    const response = await getItem(id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const createItemComment = createAsyncThunk<
  CreateCommentResponse,
  {
    data: CreateCommentRequest
    itemId: number
  },
  { rejectValue: ErrorResponse }
>('items/createItemComment', async (data, { rejectWithValue }) => {
  try {
    const response = await createComment(data.data, data.itemId)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const getItemComments = createAsyncThunk<
  GetCommentsResponse,
  number,
  { rejectValue: ErrorResponse }
>('items/getItemComments[local]', async (id, { rejectWithValue }) => {
  try {
    const response = await getComments(id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

const likeItem = createAsyncThunk<void, number, { rejectValue: ErrorResponse }>(
  'items/likeItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await like(id)
      return response.data
    } catch (error) {
      return rejectWithValue({ ...(error as Object) } as ErrorResponse)
    }
  },
)

const unlikeItem = createAsyncThunk<
  void,
  number,
  { rejectValue: ErrorResponse }
>('items/unlikeItem', async (id, { rejectWithValue }) => {
  try {
    const response = await unlike(id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const likeOrUnlike = createAsyncThunk<
  void,
  number,
  { rejectValue: ErrorResponse; dispatch: AppDispatch; state: RootState }
>('items/likeOrUnlike', async (id, { rejectWithValue, dispatch, getState }) => {
  try {
    await (getState().items.data.like
      ? dispatch(unlikeItem(id))
      : dispatch(likeItem(id)))
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const itemsSlice = createSlice({
  name: 'items',

  initialState,

  reducers: {
    reset: () => initialState,
  },

  extraReducers(builder) {
    builder
      .addCase(getItemById.fulfilled, (state, action) => {
        const { comments, ...data } = action.payload
        state.data = data
        state.comments = comments
      })

      .addCase(createItemComment.fulfilled, (state, action) => {
        state.comments.push(action.payload.comment)
      })

      .addCase(getItemComments.fulfilled, (state, action) => {
        const { comments } = action.payload
        state.comments = comments
      })

      .addCase(likeItem.fulfilled, (state) => {
        state.data.like = true
        state.data.likesCount += 1
      })

      .addCase(unlikeItem.fulfilled, (state) => {
        state.data.like = false
        state.data.likesCount -= 1
      })

      .addMatcher(isPendingAction('items/'), (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addMatcher(isFulfilledAction<void>('items/'), (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(
        isRejectedAction<ErrorResponse>('items/'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload
        },
      )
  },
})

export const { reset } = itemsSlice.actions

export const selectItemStatus = (state: RootState) => state.items.status
export const selectItemError = (state: RootState) => state.items.error
export const selectItemComments = (state: RootState) => state.items.comments
export const selectItem = (state: RootState) => state.items.data

const itemsReducer = itemsSlice.reducer

export default itemsReducer
