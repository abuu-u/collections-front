import {
  createAsyncThunk,
  createSlice,
  isPending,
  PayloadAction,
} from '@reduxjs/toolkit'
import { ItemCreateFields } from 'pages/collections/[id]/items/[...slug]'
import {
  FieldData,
  getFields,
  GetFieldsResponse,
  GetTagsResponse,
} from 'shared/apis/collections-api'
import { ErrorResponse } from 'shared/apis/error-response'
import {
  createItem,
  editItem,
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

const formIntoData = (data: ItemCreateFields) => {
  const { dateTimeFields, tags, ...restData } = data

  return {
    ...restData,
    dateTimeFields: dateTimeFields.map((it) => ({
      fieldId: it.fieldId,
      value: new Date(it.value).toISOString(),
    })),
    tags: tags.map((tag) => tag.value),
  }
}

export const createCollectionItem = createAsyncThunk<
  void,
  {
    data: ItemCreateFields
    collectionId: number
  },
  { rejectValue: ErrorResponse }
>('item/createCollectionItem', async (data, { rejectWithValue }) => {
  try {
    const response = await createItem(
      formIntoData(data.data),
      data.collectionId,
    )
    return response.data
  } catch (error) {
    return rejectWithValue({ ...(error as Object) } as ErrorResponse)
  }
})

export const editCollectionItem = createAsyncThunk<
  void,
  {
    data: ItemCreateFields
    collectionId: number
  },
  { rejectValue: ErrorResponse }
>('item/editCollectionItem', async (data, { rejectWithValue }) => {
  try {
    const response = await editItem(formIntoData(data.data), data.collectionId)
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

    removeTag: (state, action: PayloadAction<number>) => {
      state.data.tags.splice(action.payload, 1)
    },

    addTag: (state, action: PayloadAction<string>) => {
      state.data.tags.push(action.payload)
    },
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

export const { reset, removeTag, addTag } = itemSlice.actions

export const selectItemStatus = (state: RootState) => state.item.status
export const selectItemError = (state: RootState) => state.item.error
export const selectItemFields = (state: RootState) => state.item.fields
export const selectTags = (state: RootState) =>
  state.item.tags.map((tag) => ({ label: tag }))
export const selectItem = (state: RootState) => {
  const data = state.item.data
  return {
    ...data,
    dateTimeFields: data.dateTimeFields.map((date) => ({
      ...date,
      value: date.value.slice(0, 10),
    })),
    tags: data.tags.map((tag) => ({ value: tag })),
  }
}

const itemReducer = itemSlice.reducer

export default itemReducer
