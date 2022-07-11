import {
  createAsyncThunk,
  createSlice,
  isPending,
  PayloadAction,
} from '@reduxjs/toolkit'
import {
  createCollection,
  CreateCollectionRequest,
  editCollection,
  EditCollectionRequest,
  getCollection,
  GetCollectionResponse,
} from 'shared/apis/collections-api'
import { ErrorResponse } from 'shared/apis/error-response'
import { SaveImageResponse, uploadImage } from 'shared/apis/images-api'
import {
  isFulfilledAction,
  isRejectedAction,
  RootState,
} from 'shared/lib/store'

export interface CollectionState {
  data: GetCollectionResponse
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: ErrorResponse
}

const initialState: CollectionState = {
  data: {
    id: -1,
    name: '',
    description: '',
    imageUrl: '',
    topicId: 1,
    fields: [],
  },
  status: 'idle',
}

export const getCollectionById = createAsyncThunk<
  GetCollectionResponse,
  number,
  { rejectValue: ErrorResponse }
>('collection/getCollectionById', async (id, { rejectWithValue }) => {
  try {
    const response = await getCollection(id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const createUserCollection = createAsyncThunk<
  void,
  CreateCollectionRequest,
  { rejectValue: ErrorResponse }
>('collection/getCollectionById', async (data, { rejectWithValue }) => {
  try {
    const response = await createCollection(data)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const upladCollectionImage = createAsyncThunk<
  SaveImageResponse,
  File,
  { rejectValue: ErrorResponse }
>('collection/upladCollectionImage', async (img, { rejectWithValue }) => {
  try {
    const response = await uploadImage(img)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const editUserCollection = createAsyncThunk<
  void,
  EditCollectionRequest,
  { rejectValue: ErrorResponse }
>('collection/editUserCollection', async (data, { rejectWithValue }) => {
  try {
    const response = await editCollection(data)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const collectionSlice = createSlice({
  name: 'collection',

  initialState,

  reducers: {
    reset: () => initialState,

    setFieldName: (
      state,
      action: PayloadAction<{ index: number; value: string }>,
    ) => {
      state.data.fields[action.payload.index].name = action.payload.value
    },

    removeField: (state, action: PayloadAction<{ index: number }>) => {
      state.data.fields.splice(action.payload.index, 1)
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getCollectionById.fulfilled, (state, action) => {
        state.data = action.payload
      })

      .addCase(upladCollectionImage.fulfilled, (state, action) => {
        state.data.imageUrl = action.payload.imageUrl
      })

      .addMatcher(isPending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addMatcher(isFulfilledAction<void>('collection/'), (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(
        isRejectedAction<ErrorResponse>('collection/'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload
        },
      )
  },
})

export const { reset, setFieldName, removeField } = collectionSlice.actions

export const selectCollectionStatus = (state: RootState) =>
  state.collection.status
export const selectCollectionError = (state: RootState) =>
  state.collection.error
export const selectCollection = (state: RootState) => state.collection.data
export const selectCollectionImageUrl = (state: RootState) =>
  state.collection.data.imageUrl

const collectionReducer = collectionSlice.reducer

export default collectionReducer
