import { createAsyncThunk, createSlice, isPending } from '@reduxjs/toolkit'
import {
  searchCollections,
  SearchCollectionsRequest,
  SearchCollectionsResponse,
} from 'shared/apis/collections-api'
import { ErrorResponse } from 'shared/apis/error-response'
import {
  searchItems,
  SearchItemsRequest,
  SearchItemsResponse,
} from 'shared/apis/items-api'
import {
  isFulfilledAction,
  isRejectedAction,
  RootState,
} from 'shared/lib/store'

export interface SearchState {
  collectionsData: SearchCollectionsResponse
  itemsData: SearchItemsResponse
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: ErrorResponse
}

const initialState: SearchState = {
  collectionsData: {
    pagesCount: 0,
    collections: [],
  },
  itemsData: {
    pagesCount: 0,
    items: [],
  },
  status: 'idle',
}

export const searchCollectionsThunk = createAsyncThunk<
  SearchCollectionsResponse,
  SearchCollectionsRequest,
  { rejectValue: ErrorResponse }
>('search/searchCollectionsThunk', async (data, { rejectWithValue }) => {
  try {
    const response = await searchCollections(data)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const searchItemsThunk = createAsyncThunk<
  SearchItemsResponse,
  SearchItemsRequest,
  { rejectValue: ErrorResponse }
>('search/searchItemsThunk', async (data, { rejectWithValue }) => {
  try {
    const response = await searchItems(data)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const searchSlice = createSlice({
  name: 'search',

  initialState,

  reducers: {
    reset: () => initialState,
  },

  extraReducers(builder) {
    builder
      .addCase(searchCollectionsThunk.fulfilled, (state, action) => {
        state.collectionsData = action.payload
      })

      .addCase(searchItemsThunk.fulfilled, (state, action) => {
        state.itemsData = action.payload
      })

      .addMatcher(isPending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addMatcher(isFulfilledAction<void>('search'), (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(
        isRejectedAction<ErrorResponse>('search'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload
        },
      )
  },
})

export const { reset } = searchSlice.actions

export const selectSearchStatus = (state: RootState) => state.search.status
export const selectSearchError = (state: RootState) => state.search.error
export const selectFoundItems = (state: RootState) =>
  state.search.itemsData.items
export const selectFoundItemsPagesCount = (state: RootState) =>
  state.search.itemsData.pagesCount
export const selectFoundCollections = (state: RootState) =>
  state.search.collectionsData.collections
export const selectFoundCollectionsPagesCount = (state: RootState) =>
  state.search.collectionsData.pagesCount

const searchReducer = searchSlice.reducer

export default searchReducer
