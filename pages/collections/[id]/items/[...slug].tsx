import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import { red } from '@mui/material/colors'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Input from 'common/input'
import MainLayout from 'common/layout/main-layout'
import { NextLinkComposed } from 'common/link'
import Loading from 'common/loading'
import { useUser } from 'features/auth/use-user'
import {
  createCollectionItem,
  editCollectionItem,
  getItemFields,
  getItemForEdit,
  reset,
  selectItem,
  selectItemError,
  selectItemFields,
  selectItemStatus,
} from 'features/items/item-slice'
import { itemSchema } from 'features/items/item-validation'
import TagCreator from 'features/items/tag-creator'
import type { NextPage } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { FieldType } from 'shared/apis/collections-api'
import { EditItemRequest } from 'shared/apis/items-api'
import { routes } from 'shared/constants/routes'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'

export type ItemCreateFields = Omit<EditItemRequest, 'tags'> & {
  tags: { value: string }[]
}

const ItemCreate: NextPage = () => {
  useUser()
  const router = useRouter()

  const intl = useIntl()

  const status = useAppSelector(selectItemStatus)
  const error = useAppSelector(selectItemError)
  const fields = useAppSelector(selectItemFields)
  const data = useAppSelector(selectItem)

  const {
    register,
    handleSubmit,
    control,
    reset: resetForm,
    formState: { errors },
  } = useForm<ItemCreateFields>({
    defaultValues: data,
    resolver: yupResolver(itemSchema),
  })

  const {
    fields: tags,
    append,
    remove,
  } = useFieldArray({
    name: 'tags',
    control,
  })
  const [type, setType] = useState('')

  const handleFormSubmit = handleSubmit(async (data) => {
    const result = await (type === 'create'
      ? dispatch(
          createCollectionItem({
            data,
            collectionId: Number(router.query.id),
          }),
        )
      : dispatch(
          editCollectionItem({
            data,
            collectionId: Number(router.query.id),
          }),
        ))
    if (result.meta.requestStatus === 'fulfilled') {
      router.push(`${routes.COLLECTIONS}/${router.query.id}`)
    }
  })

  const dispatch = useAppDispatch()

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isNotFound, setIsNotFound] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  useEffect(() => {
    const collectionId = Number(router.query.id)
    if (!Number.isNaN(collectionId)) {
      const [itemIdString, edit] = router.query.slug as string[]
      const itemId = Number(itemIdString)
      const [create] = router.query.slug as string[]
      if (create === 'create') {
        setType(create)
        dispatch(getItemFields(collectionId))
      } else if (edit === 'edit' && !Number.isNaN(itemId)) {
        setType(edit)
        dispatch(getItemForEdit(itemId))
      } else {
        setIsNotFound(true)
      }
    }
  }, [dispatch, router])

  useEffect(() => {
    if (status === 'succeeded' && isInitialLoad) {
      if (type === 'edit') {
        resetForm(data)
      }
      setIsInitialLoad(false)
    }
  }, [data, isInitialLoad, resetForm, status, type])

  if (isInitialLoad && error?.status !== 404) {
    return <Loading open={true} />
  }

  if (error?.status === 404 || isNotFound) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <MainLayout>
      <Loading open={status === 'loading'} />

      <Typography component="h1" variant="h4" textAlign="center" mb="20px">
        <FormattedMessage id={`item.${type}`} />
      </Typography>

      <Stack
        maxWidth={500}
        margin="auto"
        mb={2}
        component="form"
        spacing={2}
        onSubmit={handleFormSubmit}
      >
        {status === 'failed' && (
          <Typography
            color="white"
            variant="body1"
            mb="20px"
            width="100%"
            padding="10px"
            bgcolor={red[300]}
          >
            {error?.message}
          </Typography>
        )}

        <Input
          label={intl.formatMessage({ id: 'my-collections-page.name' })}
          error={errors.name?.message}
          {...register('name')}
        />

        <Stack direction="row" flexWrap="wrap" alignItems="flex-start">
          {tags.map((item, index) => (
            <Chip
              sx={{ margin: 1 }}
              key={index}
              label={item.value}
              onDelete={() => remove(index)}
            />
          ))}
        </Stack>

        <TagCreator append={append} />

        {fields
          .filter(
            (field) =>
              field.fieldType === FieldType.String ||
              field.fieldType === FieldType.MultiLineString,
          )
          .map((field, index) => {
            register(`stringFields.${index}.fieldId`, { value: field.id })
            return (
              <Input
                key={field.id}
                label={field.name}
                multiline={field.fieldType === FieldType.MultiLineString}
                minRows={2}
                maxRows={10}
                error={errors.stringFields?.[index]?.value?.message}
                {...register(`stringFields.${index}.value`)}
              />
            )
          })}

        {fields
          .filter((field) => field.fieldType === FieldType.Int)
          .map((field, index) => {
            register(`intFields.${index}.fieldId`, { value: field.id })
            return (
              <Input
                type="number"
                key={field.id}
                error={errors.intFields?.[index]?.value?.message}
                {...register(`intFields.${index}.value`)}
                label={field.name}
              />
            )
          })}

        {fields
          .filter((field) => field.fieldType === FieldType.Bool)
          .map((field, index) => {
            register(`boolFields.${index}.fieldId`, { value: field.id })
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    {...register(`boolFields.${index}.value`)}
                    defaultChecked={data.boolFields[index]?.value}
                  />
                }
                key={field.id}
                label={field.name}
              />
            )
          })}

        {fields
          .filter((field) => field.fieldType === FieldType.DateTime)
          .map((field, index) => {
            register(`dateTimeFields.${index}.fieldId`, { value: field.id })
            return (
              <Input
                type="date"
                key={field.id}
                error={errors.dateTimeFields?.[index]?.value?.message}
                {...register(`dateTimeFields.${index}.value`)}
                label={field.name}
              />
            )
          })}

        <Stack
          direction="row"
          justifyContent="center"
          spacing={1}
          sx={{ mb: 1 }}
        >
          <Button variant="contained" type="submit">
            {intl.formatMessage({ id: `item.${type}` })}
          </Button>

          <Button
            component={NextLinkComposed}
            to={`${routes.COLLECTIONS}/${router.query.id}`}
            variant="outlined"
          >
            <FormattedMessage id="my-collections-page.cancel" />
          </Button>
        </Stack>
      </Stack>
    </MainLayout>
  )
}

export default ItemCreate
