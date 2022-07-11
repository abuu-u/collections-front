import * as yup from 'yup'

export const itemSchema = yup.object().shape({
  name: yup.string().required('validation.required'),
  dateTimeFields: yup.array(
    yup.object({
      value: yup.string().required('validation.required'),
    }),
  ),
  intFields: yup.array(
    yup.object({
      value: yup.number().required('validation.required'),
    }),
  ),
  stringFields: yup.array(
    yup.object({
      value: yup.string().required('validation.required'),
    }),
  ),
})

export const tagSchema = yup.object().shape({
  value: yup.string().required('validation.required'),
})

export const commentSchema = yup.object().shape({
  text: yup.string().required('validation.required'),
})
