import { urls } from '../constants/urls'
import { api } from './api'
import { apiWithJwt } from './api-with-jwt'
import { DateTimeValueData, StringValueData } from './items-api'

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

export enum FieldType {
  String,
  MultiLineString,
  Int,
  Bool,
  DateTime,
}

export interface CreateFieldData {
  name: string
  fieldType: FieldType
}

export interface CreateCollectionRequest {
  name: string
  description: string
  topicId: number
  fields: CreateFieldData[]
  imageUrl?: string
}

export interface EditCollectionRequest {
  id: number
  name?: string
  description?: string
  topicId?: number
  fields: FieldData[]
  imageUrl?: string
}

export interface GetCollectionItemsRequest {
  sortFieldId?: number
  sortFieldType?: FieldType
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
  items: CollectionItemData[]
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

export const getCollectionItems = async (
  data: GetCollectionItemsRequest,
  id: number,
) => {
  const { filterTags, ...restData } = data
  const filterTagsParameter = filterTags?.join('&filterTags=')
  const response = await api.get<GetCollectionItemsResponse>(
    `${urls.COLLECTIONS}/${id}`,
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
