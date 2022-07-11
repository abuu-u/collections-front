import { createAsyncThunk, createSlice, isPending } from '@reduxjs/toolkit'
import {
  getLargestCollections,
  GetLargestCollectionsResponse,
  GetTagsResponse,
} from 'shared/apis/collections-api'
import { ErrorResponse } from 'shared/apis/error-response'
import {
  getLatestItems,
  GetLatestItemsRequest,
  GetLatestItemsResponse,
  getMostUsedTags,
  GetMostUsedTagsRequest,
} from 'shared/apis/items-api'
import {
  isFulfilledAction,
  isRejectedAction,
  RootState,
} from 'shared/lib/store'

export interface HomeState {
  tags: string[]
  items: GetLatestItemsResponse['items']
  collections: GetLargestCollectionsResponse['collections']
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: ErrorResponse
}

const initialState: HomeState = {
  items: [],
  collections: [],
  tags: [],
  status: 'idle',
}

export const getTags = createAsyncThunk<
  GetTagsResponse,
  GetMostUsedTagsRequest,
  { rejectValue: ErrorResponse }
>('home/getTags', async (data, { rejectWithValue }) => {
  try {
    const response = await getMostUsedTags(data)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const getItems = createAsyncThunk<
  GetLatestItemsResponse,
  GetLatestItemsRequest,
  { rejectValue: ErrorResponse }
>('home/getItems', async (data, { rejectWithValue }) => {
  try {
    const response = await getLatestItems(data)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const getCollections = createAsyncThunk<
  GetLargestCollectionsResponse,
  number,
  { rejectValue: ErrorResponse }
>('home/getCollections', async (count, { rejectWithValue }) => {
  try {
    const response = await getLargestCollections(count)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const homeSlice = createSlice({
  name: 'home',

  initialState,

  reducers: {
    reset: () => initialState,
  },

  extraReducers(builder) {
    builder
      .addCase(getTags.fulfilled, (state, action) => {
        state.tags = action.payload.tags
      })

      .addCase(getItems.fulfilled, (state, action) => {
        state.items = action.payload.items
      })

      .addCase(getCollections.fulfilled, (state, action) => {
        state.collections = action.payload.collections
      })

      .addMatcher(isPending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addMatcher(isFulfilledAction<void>('home/'), (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(isRejectedAction<ErrorResponse>('home/'), (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { reset } = homeSlice.actions

export const selectHomeStatus = (state: RootState) => state.home.status
export const selectHomeError = (state: RootState) => state.home.error
export const selectHomeTags = (state: RootState) => state.home.tags
export const selectHomeItems = (state: RootState) => state.home.items
export const selectHomeCollections = (state: RootState) =>
  state.home.collections

const homeReducer = homeSlice.reducer

export default homeReducer
