import {
  createAsyncThunk,
  createSlice,
  isPending,
  PayloadAction,
} from '@reduxjs/toolkit'
import {
  getCollection,
  getCollectionItems,
  GetCollectionItemsRequest,
  GetCollectionItemsResponse,
  GetCollectionResponse,
} from 'shared/apis/collections-api'
import { ErrorResponse } from 'shared/apis/error-response'
import { deleteItems, DeleteItemsRequest } from 'shared/apis/items-api'
import {
  AppDispatch,
  isFulfilledAction,
  isRejectedAction,
  RootState,
} from 'shared/lib/store'

export interface CollectionItemsState {
  data: Omit<Omit<GetCollectionResponse, 'items'>, 'fields'>
  items: GetCollectionResponse['items']
  fields: GetCollectionResponse['fields']
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: ErrorResponse
  params: GetCollectionItemsRequest
}

const initialState: CollectionItemsState = {
  data: {
    id: 0,
    name: '',
    description: '',
    topicId: 0,
    imageUrl: '',
    isOwner: false,
  },
  items: [],
  fields: [],
  params: {},
  status: 'idle',
}

export const getItems = createAsyncThunk<
  GetCollectionItemsResponse,
  number,
  { rejectValue: ErrorResponse; state: RootState }
>('collectionItems/getItems', async (id, { rejectWithValue, getState }) => {
  const state = getState().collectionItems
  try {
    const response = await getCollectionItems(state.params, id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const deleteCollectionItems = createAsyncThunk<
  void,
  {
    data: DeleteItemsRequest
    collectionId: number
  },
  { rejectValue: ErrorResponse; dispatch: AppDispatch }
>(
  'collectionItems/deleteItems',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await deleteItems(data.data, data.collectionId)
      await dispatch(getItems(data.collectionId))
      return response.data
    } catch (error) {
      return rejectWithValue({ ...(error as Object) } as ErrorResponse)
    }
  },
)

export const getCollectionById = createAsyncThunk<
  GetCollectionResponse,
  number,
  { rejectValue: ErrorResponse }
>('collectionItems/getCollectionFields', async (id, { rejectWithValue }) => {
  try {
    const response = await getCollection(id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const collectionItemsSlice = createSlice({
  name: 'collectionItems',

  initialState,

  reducers: {
    reset: () => initialState,

    setFilterName: (
      state,
      action: PayloadAction<GetCollectionItemsRequest['filterName']>,
    ) => {
      state.params.filterName = action.payload
    },

    setSortBy: (
      state,
      action: PayloadAction<GetCollectionItemsRequest['sortBy']>,
    ) => {
      state.params.sortBy = action.payload
    },

    setSortFieldId: (
      state,
      action: PayloadAction<GetCollectionItemsRequest['sortFieldId']>,
    ) => {
      state.params.sortFieldId = action.payload
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getItems.fulfilled, (state, action) => {
        state.items = action.payload.items
      })
      .addCase(getCollectionById.fulfilled, (state, action) => {
        const { items, fields, ...data } = action.payload
        state.items = items
        state.fields = fields
        state.data = data
      })

      .addMatcher(isPending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addMatcher(isFulfilledAction<void>('collectionItems/'), (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(
        isRejectedAction<ErrorResponse>('collectionItems/'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload
        },
      )
  },
})

export const { reset, setFilterName, setSortBy, setSortFieldId } =
  collectionItemsSlice.actions

export const selectCollectionItemsStatus = (state: RootState) =>
  state.collectionItems.status
export const selectCollectionItemsError = (state: RootState) =>
  state.collectionItems.error
export const selectCollectionItems = (state: RootState) =>
  state.collectionItems.items
export const selectCollection = (state: RootState) => state.collectionItems.data
export const selectCollectionisOwner = (state: RootState) =>
  state.collectionItems.data.isOwner
export const selectCollectionFields = (state: RootState) =>
  state.collectionItems.fields

const collectionItemsReducer = collectionItemsSlice.reducer

export default collectionItemsReducer
