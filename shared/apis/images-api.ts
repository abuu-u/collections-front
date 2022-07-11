import { urls } from 'shared/constants/urls'
import { apiWithJwt } from './api-with-jwt'

export interface SaveImageResponse {
  imageUrl: string
}

export const uploadImage = async (image: File) => {
  const formData = new FormData()
  formData.append('Image', image)
  const response = await apiWithJwt.post<SaveImageResponse>(
    urls.IMAGES,
    formData,
  )
  return response
}
