import { createAsyncThunk, createSlice, isPending } from '@reduxjs/toolkit'
import {
  FieldData,
  getFields,
  GetFieldsResponse,
  GetTagsResponse,
} from 'shared/apis/collections-api'
import { ErrorResponse } from 'shared/apis/error-response'
import {
  AddItemRequest,
  createItem,
  editItem,
  EditItemRequest,
  getItemForEditing,
  GetItemForEditingResponse,
  searchTags,
  SearchTagsRequest,
} from 'shared/apis/items-api'
import {
  isFulfilledAction,
  isRejectedAction,
  RootState,
} from 'shared/lib/store'

export interface ItemState {
  data: Omit<GetItemForEditingResponse, 'fields'>
  fields: FieldData[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: ErrorResponse
  tags: GetTagsResponse['tags']
}

const initialState: ItemState = {
  data: {
    name: '',
    tags: [],
    boolFields: [],
    dateTimeFields: [],
    intFields: [],
    stringFields: [],
  },
  fields: [],
  status: 'idle',
  tags: [],
}

export const createCollectionItem = createAsyncThunk<
  void,
  {
    data: AddItemRequest
    collectionId: number
  },
  { rejectValue: ErrorResponse }
>('item/createCollectionItem', async (data, { rejectWithValue }) => {
  try {
    const response = await createItem(data.data, data.collectionId)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const editCollectionItem = createAsyncThunk<
  void,
  {
    data: EditItemRequest
    collectionId: number
  },
  { rejectValue: ErrorResponse }
>('item/editCollectionItem', async (data, { rejectWithValue }) => {
  try {
    const response = await editItem(data.data, data.collectionId)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const getItemForEdit = createAsyncThunk<
  GetItemForEditingResponse,
  number,
  { rejectValue: ErrorResponse }
>('item/getItemForEdit', async (id, { rejectWithValue }) => {
  try {
    const response = await getItemForEditing(id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const getItemFields = createAsyncThunk<
  GetFieldsResponse,
  number,
  { rejectValue: ErrorResponse }
>('item/getItemFields', async (id, { rejectWithValue }) => {
  try {
    const response = await getFields(id)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const searchTagsByText = createAsyncThunk<
  GetTagsResponse,
  SearchTagsRequest,
  { rejectValue: ErrorResponse }
>('item/searchTagsByText', async (data, { rejectWithValue }) => {
  try {
    const response = await searchTags(data)
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const itemSlice = createSlice({
  name: 'item',

  initialState,

  reducers: {
    reset: () => initialState,
  },

  extraReducers(builder) {
    builder
      .addCase(getItemForEdit.fulfilled, (state, action) => {
        const { fields, ...data } = action.payload
        state.data = data
        state.fields = fields
      })

      .addCase(getItemFields.fulfilled, (state, action) => {
        state.fields = action.payload.fields
      })

      .addCase(searchTagsByText.fulfilled, (state, action) => {
        state.tags = action.payload.tags
      })

      .addMatcher(isPending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addMatcher(isFulfilledAction<void>('item/'), (state) => {
        state.status = 'succeeded'
      })
      .addMatcher(isRejectedAction<ErrorResponse>('item/'), (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { reset } = itemSlice.actions

export const selectItemStatus = (state: RootState) => state.item.status
export const selectItemError = (state: RootState) => state.item.error
export const selectItemFields = (state: RootState) => state.item.fields
export const selectTags = (state: RootState) => state.item.tags
export const selectItem = (state: RootState) => state.item.data

const itemReducer = itemSlice.reducer

export default itemReducer