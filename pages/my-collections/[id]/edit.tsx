import { yupResolver } from '@hookform/resolvers/yup'
import { Clear } from '@mui/icons-material'
import { red } from '@mui/material/colors'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Input from 'common/input'
import Loading from 'common/loading'
import CollectionForm, {
  CollectionFormControl,
  CollectionFormRegister,
} from 'features/collections/collection-form'
import {
  editUserCollection,
  getCollectionById,
  reset,
  selectCollection,
  selectCollectionError,
  selectCollectionStatus,
} from 'features/collections/collection-slice'
import { collectionSchema } from 'features/collections/collection-validation'
import type { NextPage } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { EditCollectionRequest } from 'shared/apis/collections-api'
import { routes } from 'shared/constants/routes'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'

const CollectionEdit: NextPage = () => {
  const router = useRouter()

  const intl = useIntl()

  const dispatch = useAppDispatch()

  const data = useAppSelector(selectCollection)
  const status = useAppSelector(selectCollectionStatus)
  const error = useAppSelector(selectCollectionError)

  const {
    control,
    register,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<EditCollectionRequest, 'imageUrl'>>({
    defaultValues: data,
    resolver: yupResolver(collectionSchema),
  })

  useEffect(() => {
    resetForm(data)
  }, [resetForm, data])

  const { fields, remove } = useFieldArray({
    name: 'fields',
    control,
  })

  const handleFormSubmit = handleSubmit(async (data) => {
    const result = await dispatch(editUserCollection(data))
    if (result.meta.requestStatus === 'fulfilled') {
      router.push(routes.MY_COLLECTIONS)
    }
  })

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isNotFound, setIsNotFound] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  useEffect(() => {
    const id = router.query.id
    if (id !== undefined) {
      const collectionId = Number(id)
      if (!Number.isNaN(collectionId)) {
        dispatch(getCollectionById(collectionId))
      } else {
        setIsNotFound(true)
      }
    }
  }, [dispatch, router])

  useEffect(() => {
    if (status === 'succeeded' && isInitialLoad) {
      setIsInitialLoad(false)
    }
  }, [isInitialLoad, status])

  if (isInitialLoad && error?.status !== 404) {
    return <Loading open={true} />
  }

  if (error?.status === 404 || isNotFound) {
    return <DefaultErrorPage statusCode={404} />
  }

  return (
    <CollectionForm
      onSubmit={handleFormSubmit}
      title={intl.formatMessage({ id: 'my-collections-page.edit' })}
      control={control as unknown as CollectionFormControl}
      errors={errors}
      register={register as unknown as CollectionFormRegister}
      isClient={isClient}
    >
      <Stack direction="column" spacing={1} sx={{ mb: 1 }}>
        {!!errors.fields?.message ? (
          <Typography
            color="white"
            variant="body1"
            mb="20px"
            width="100%"
            padding="10px"
            bgcolor={red[300]}
          >
            {intl.formatMessage({ id: errors.fields.message })}
          </Typography>
        ) : undefined}

        {isClient
          ? fields.map((item, index) => (
              <Stack direction="row" spacing={1} sx={{ mb: 1 }} key={item.id}>
                <Input
                  fullWidth
                  label={intl.formatMessage({
                    id: 'my-collections-page.name',
                  })}
                  error={errors.name?.message}
                  {...register(`fields.${index}.name`)}
                />

                <IconButton onClick={() => remove(index)}>
                  <Clear />
                </IconButton>
              </Stack>
            ))
          : undefined}
      </Stack>
    </CollectionForm>
  )
}

export default CollectionEdit
