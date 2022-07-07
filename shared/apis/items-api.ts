import { urls } from '../constants/urls'
import { api } from './api'
import { apiWithJwt } from './api-with-jwt'
import { FieldData, GetTagsResponse } from './collections-api'

export interface IntValueData {
  fieldId: number
  value: number
}

export interface BoolValueData {
  fieldId: number
  value: boolean
}

export interface StringValueData {
  fieldId: number
  value: string
}

export interface DateTimeValueData {
  fieldId: number
  value: string
}

export interface AddItemRequest {
  name: string
  tags: string[]
  intFields: IntValueData[]
  boolFields: BoolValueData[]
  stringFields: StringValueData[]
  dateTimeFields: DateTimeValueData[]
}

export interface EditItemRequest {
  id: number
  name?: string
  tags: string[]
  intFields: IntValueData[]
  boolFields: BoolValueData[]
  stringFields: StringValueData[]
  dateTimeFields: DateTimeValueData[]
}

export interface DeleteItemRequest {
  collectionId: number
  itemId: number
}

export interface DeleteItemsRequest {
  ids: number[]
}

export interface SearchItemsRequest {
  searchString: string
  page: number
  count: number
}

export interface SearchItemData {
  id: number
  name: string
}

export interface SearchItemsResponse {
  pagesCount: number
  items: SearchItemData[]
}

export interface CreateCommentRequest {
  text: string
}

export interface CommentAuthorData {
  name: string
}

export interface CommentData {
  text: string
  author: CommentAuthorData
}

export interface CreateCommentResponse {
  comment: CommentData
}

export interface GetCommentsResponse {
  comments: CommentData[]
}

export interface GetItemResponse {
  name: string
  tags: string[]
  comments: CommentData[]
  likesCount: number
  like: boolean
  fields: FieldData[]
  intValues: IntValueData[]
  boolValues: BoolValueData[]
  stringValues: StringValueData[]
  dateTimeValues: DateTimeValueData[]
}

export interface GetLatestItemsRequest {
  count: number
}

export interface LatestItemOwnerData {
  name: string
}

export interface LatestCollectionData {
  name: string
  ownerData: LatestItemOwnerData
}

export interface LatestItemData {
  id: number
  name: string
  collection: LatestCollectionData
}

export interface GetLatestItemsResponse {
  items: LatestItemData[]
}

export interface GetMostUsedTagsRequest {
  count: number
}

export interface SearchTagsRequest {
  str: string
  count: number
}

export const createItem = async (
  data: AddItemRequest,
  collectionId: number,
) => {
  const response = await apiWithJwt.post(
    `${urls.COLLECTIONS}/${collectionId}/${urls.ITEMS}`,
    data,
  )
  return response
}

export const editItem = async (data: EditItemRequest, collectionId: number) => {
  const response = await apiWithJwt.put(
    `${urls.COLLECTIONS}/${collectionId}/${urls.ITEMS}`,
    data,
  )
  return response
}

export const deleteItem = async (data: DeleteItemRequest) => {
  const response = await apiWithJwt.delete(
    `${urls.COLLECTIONS}/${data.collectionId}/${urls.ITEMS}/${data.itemId}`,
  )
  return response
}

export const deleteItems = async (
  data: DeleteItemsRequest,
  collectionId: number,
) => {
  const response = await apiWithJwt.delete(
    `${urls.COLLECTIONS}/${collectionId}/${urls.ITEMS}`,
    { data: data.ids },
  )
  return response
}

export const searchItems = async (parameters: SearchItemsRequest) => {
  const response = await api.get<SearchItemsResponse>(`${urls.ITEMS}/search`, {
    params: parameters,
  })
  return response
}

export const createComment = async (
  data: CreateCommentRequest,
  itemId: number,
) => {
  const response = await apiWithJwt.post<CreateCommentResponse>(
    `${urls.ITEMS}/${itemId}`,
    data,
  )
  return response
}

export const getComments = async (itemId: number) => {
  const response = await api.get<GetCommentsResponse>(
    `${urls.ITEMS}/${itemId}/comments`,
  )
  return response
}

export const like = async (itemId: number) => {
  const response = await apiWithJwt.post(`${urls.ITEMS}/${itemId}/like`)
  return response
}

export const unlike = async (itemId: number) => {
  const response = await apiWithJwt.post(`${urls.ITEMS}/${itemId}/unlike`)
  return response
}

export const getItem = async (itemId: number) => {
  const response = await api.get<GetItemResponse>(`${urls.ITEMS}/${itemId}`)
  return response
}

export const getLatestItems = async (parameters: GetLatestItemsRequest) => {
  const response = await api.get<GetLatestItemsResponse>(
    `${urls.ITEMS}/latest`,
    {
      params: parameters,
    },
  )
  return response
}

export const getMostUsedTags = async (parameters: GetMostUsedTagsRequest) => {
  const response = await api.get<GetTagsResponse>(`${urls.TAGS}`, {
    params: parameters,
  })
  return response
}

export const searchTags = async (parameters: SearchTagsRequest) => {
  const response = await api.get<GetTagsResponse>(`${urls.TAGS}/search`, {
    params: parameters,
  })
  return response
}
