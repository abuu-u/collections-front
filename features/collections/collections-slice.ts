import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  deleteCollection,
  GetCollectionsRequest,
  getMyCollections,
  GetMyCollectionsResponse,
} from 'shared/apis/collections-api'
import { ErrorResponse } from 'shared/apis/error-response'
import { RootState } from 'shared/lib/store'

export interface CollectionsState {
  data: GetMyCollectionsResponse
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: ErrorResponse
}

const initialState: CollectionsState = {
  data: {
    pagesCount: 0,
    collections: [],
  },
  status: 'idle',
}

export const getUserCollections = createAsyncThunk<
  GetMyCollectionsResponse,
  GetCollectionsRequest,
  { rejectValue: ErrorResponse }
>('collections/getUserCollections', async (data, { rejectWithValue }) => {
  try {
    const response = await getMyCollections(data)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const deleteUserCollection = createAsyncThunk<
  void,
  number,
  { rejectValue: ErrorResponse }
>('collections/deleteCollection', async (id, { rejectWithValue }) => {
  try {
    const response = await deleteCollection(id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const collectionsSlice = createSlice({
  name: 'collections',

  initialState,

  reducers: {
    reset: () => initialState,
  },

  extraReducers(builder) {
    builder
      .addCase(getUserCollections.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })

      .addCase(getUserCollections.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(getUserCollections.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { reset } = collectionsSlice.actions

export const selectCollectionsStatus = (state: RootState) =>
  state.collections.status
export const selectCollectionsError = (state: RootState) =>
  state.collections.error
export const selectCollections = (state: RootState) =>
  state.collections.data.collections
export const selectCollectionsPagesCount = (state: RootState) =>
  state.collections.data.pagesCount

const collectionsReducer = collectionsSlice.reducer

export default collectionsReducer
