import { fieldTypes } from 'shared/apis/collections-api'
import { topics } from 'shared/localization/topics'
import * as yup from 'yup'

const topicIds = Object.keys(topics.en).map((key) => Number.parseInt(key))

export const collectionSchema = yup.object().shape({
  description: yup.string().required('validation.required'),
  fields: yup
    .array(
      yup.object({
        name: yup.string().required('validation.required'),
        fieldType: yup
          .number()
          .min(Math.min(...fieldTypes), 'validation.min')
          .max(Math.max(...fieldTypes), 'validation.max')
          .required('validation.required'),
      }),
    )
    .min(1, 'validation.must-not-be-empty'),
  name: yup.string().required('validation.required'),
  topicId: yup
    .number()
    .min(Math.min(...topicIds), 'validation.min')
    .max(Math.max(...topicIds), 'validation.max')
    .required('validation.required'),
})
