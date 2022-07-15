import {
  Action,
  AsyncThunk,
  configureStore,
  createListenerMiddleware,
  PayloadAction,
  ThunkAction,
} from '@reduxjs/toolkit'
import adminReducer from 'features/admin/admin-slice'
import authReducer, { logout } from 'features/auth/auth-slice'
import collectionItemsReducer from 'features/collections/collection-items-slice'
import collectionReducer from 'features/collections/collection-slice'
import collectionsReducer from 'features/collections/collections-slice'
import homeReducer from 'features/home/home-slice'
import itemReducer from 'features/items/item-slice'
import itemsReducer from 'features/items/items-slice'
import searchReducer from 'features/search/search-slice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { ErrorResponse } from 'shared/apis/error-response'

export const isPendingAction =
  <T>(startsWith: string) =>
  (action: FulfilledAction<T>): action is FulfilledAction<T> =>
    !action.type.endsWith('[local]/pending') &&
    action.type.endsWith('/pending') &&
    action.type.startsWith(startsWith)

export const isFulfilledAction =
  <T>(startsWith: string) =>
  (action: FulfilledAction<T>): action is FulfilledAction<T> =>
    action.type.endsWith('/fulfilled') && action.type.startsWith(startsWith)

export const isRejectedAction =
  <T>(startsWith: string) =>
  (action: RejectedAction<T>): action is RejectedAction<T> =>
    action.type.endsWith('/rejected') && action.type.startsWith(startsWith)

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  // @ts-ignore
  matcher: (action: PayloadAction<ErrorResponse>) => {
    const payload = action?.payload
    if (payload && !action.type.endsWith('[local]/rejected')) {
      return payload.status === 401
    }
  },
  effect: (action, listenerApi) => {
    listenerApi.dispatch(logout())
    listenerApi.dispatch({
      ...action,
      type:
        (action.type as string).split('/').slice(0, -1).join('/') +
        '[local]/rejected',
    })
  },
})

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    collection: collectionReducer,
    collections: collectionsReducer,
    collectionItems: collectionItemsReducer,
    item: itemReducer,
    search: searchReducer,
    home: homeReducer,
    items: itemsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
type GenericAsyncThunk<R = void, E = void> = AsyncThunk<
  R,
  unknown,
  { rejectValue: E }
>
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>
export type RejectedAction<T> = ReturnType<
  GenericAsyncThunk<void, T>['rejected']
>
export type FulfilledAction<T> = ReturnType<GenericAsyncThunk<T>['fulfilled']>

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
