import { urls } from 'shared/constants/urls'
import { api } from './api'
import { apiWithJwt } from './api-with-jwt'
import {
  BoolValueData,
  DateTimeValueData,
  IntValueData,
  StringValueData,
} from './items-api'

export interface GetCollectionsRequest {
  page: number
  count: number
}

export interface FieldData {
  id: number
  name: string
  fieldType: FieldType
}

export interface CollectionData {
  id: number
  name: string
  description: string
  topicId: number
  fields: FieldData[]
  imageUrl?: string
}

export interface GetMyCollectionsResponse {
  pagesCount: number
  collections: CollectionData[]
}

export const enum FieldType {
  String,
  MultiLineString,
  Int,
  Bool,
  DateTime,
}

export const fieldTypes = [
  FieldType.String,
  FieldType.MultiLineString,
  FieldType.Int,
  FieldType.Bool,
  FieldType.DateTime,
]

export const fieldTypeNames = {
  [FieldType.String]: 'string',
  [FieldType.MultiLineString]: 'multiLineString',
  [FieldType.Int]: 'int',
  [FieldType.Bool]: 'bool',
  [FieldType.DateTime]: 'dateTime',
} as const

export interface CreateFieldData {
  name: string
  fieldType: FieldType
}

export interface EditCollectionData {
  name?: string
  description?: string
  topicId?: number
}

export type CreateCollectionRequest = Required<EditCollectionData> & {
  fields: CreateFieldData[]
  imageUrl?: string
}

export interface EditCollectionFieldData {
  id: number
  name: string
}

export type EditCollectionRequest = EditCollectionData & {
  id: number
  fields: EditCollectionFieldData[]
  imageUrl?: string
}

export interface ItemData {
  id: number
  name: string
  stringValues: StringValueData[]
  dateTimeValues: DateTimeValueData[]
  boolValues: BoolValueData[]
  intValues: IntValueData[]
}

export interface GetCollectionResponse {
  id: number
  name: string
  description: string
  topicId: number
  imageUrl?: string
  fields: FieldData[]
  items: ItemData[]
  isOwner: boolean
}

export interface GetCollectionForEditResponse {
  id: number
  name: string
  description: string
  topicId: number
  imageUrl?: string
  fields: FieldData[]
}

export interface GetCollectionItemsRequest {
  sortFieldId?: number
  sortBy?: 'asc' | 'desc'
  filterName?: string
  filterTags?: string[]
}

export interface CollectionItemData {
  id: number
  name: string
  stringValues: StringValueData[]
  dateTimeValues: DateTimeValueData[]
}

export interface GetCollectionItemsResponse {
  isOwner: boolean
  items: ItemData[]
}

export interface GetFieldsResponse {
  fields: FieldData[]
}

export interface SearchCollectionsRequest {
  searchString: string
  page: number
  count: number
}

export interface SearchCollectionData {
  id: number
  name: string
}

export interface SearchCollectionsResponse {
  pagesCount: number
  collections: SearchCollectionData[]
}

export interface GetLargestCollectionsResponse {
  collections: CollectionData[]
}

export interface GetTagsResponse {
  tags: string[]
}

export const getMyCollections = async (parameters: GetCollectionsRequest) => {
  const response = await apiWithJwt.get<GetMyCollectionsResponse>(
    urls.COLLECTIONS,
    {
      params: parameters,
    },
  )
  return response
}

export const createCollection = async (data: CreateCollectionRequest) => {
  const response = await apiWithJwt.post(urls.COLLECTIONS, data)
  return response
}

export const editCollection = async (data: EditCollectionRequest) => {
  const response = await apiWithJwt.put(urls.COLLECTIONS, data)
  return response
}

export const deleteCollection = async (id: number) => {
  const response = await apiWithJwt.delete(`${urls.COLLECTIONS}/${id}`)
  return response
}

export const getCollectionForEdit = async (id: number) => {
  const response = await apiWithJwt.get<GetCollectionForEditResponse>(
    `${urls.COLLECTIONS}/${id}/for-edit`,
  )
  return response
}

export const getCollection = async (id: number) => {
  const response = await apiWithJwt.get<GetCollectionResponse>(
    `${urls.COLLECTIONS}/${id}`,
  )
  return response
}

export const getCollectionItems = async (
  data: GetCollectionItemsRequest,
  id: number,
) => {
  const { filterTags, ...restData } = data
  const filterTagsParameter = filterTags?.join('&filterTags=')
  const response = await apiWithJwt.get<GetCollectionItemsResponse>(
    `${urls.COLLECTIONS}/${id}/items`,
    {
      params: { ...restData, filterTags: filterTagsParameter },
    },
  )
  return response
}

export const getFields = async (id: number) => {
  const response = await api.get<GetFieldsResponse>(
    `${urls.COLLECTIONS}/${id}/fields`,
  )
  return response
}

export const searchCollections = async (
  parameters: SearchCollectionsRequest,
) => {
  const response = await api.get<SearchCollectionsResponse>(
    `${urls.COLLECTIONS}/search`,
    {
      params: parameters,
    },
  )
  return response
}

export const getLargestCollections = async (count: number) => {
  const response = await api.get<GetLargestCollectionsResponse>(
    `${urls.COLLECTIONS}/largest`,
    {
      params: {
        count,
      },
    },
  )
  return response
}

export const getCollectionTags = async (id: number) => {
  const response = await api.get<GetTagsResponse>(
    `${urls.COLLECTIONS}/${id}/tags`,
  )
  return response
}
