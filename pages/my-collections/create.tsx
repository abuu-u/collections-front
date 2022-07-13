import { yupResolver } from '@hookform/resolvers/yup'
import { Clear } from '@mui/icons-material'
import Button from '@mui/material/Button'
import { red } from '@mui/material/colors'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Input from 'common/input'
import { useUser } from 'features/auth/use-user'
import CollectionForm, {
  CollectionFormControl,
  CollectionFormRegister,
} from 'features/collections/collection-form'
import { createUserCollection } from 'features/collections/collection-slice'
import { collectionSchema } from 'features/collections/collection-validation'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  CreateCollectionRequest,
  FieldType,
  fieldTypeNames,
  fieldTypes,
} from 'shared/apis/collections-api'
import { routes } from 'shared/constants/routes'
import { useAppDispatch } from 'shared/lib/store'

const DEFAULT_FIELD = { name: '', fieldType: FieldType.String }

const CollectionCreate: NextPage = () => {
  useUser()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<CreateCollectionRequest, 'imageUrl'>>({
    defaultValues: {
      name: '',
      description: '',
      fields: [DEFAULT_FIELD],
      topicId: 1,
    },
    resolver: yupResolver(collectionSchema),
  })

  const { fields, append, remove } = useFieldArray({
    name: 'fields',
    control,
  })

  const intl = useIntl()

  const dispatch = useAppDispatch()

  const router = useRouter()

  const handleFormSubmit = handleSubmit(async (data) => {
    const result = await dispatch(createUserCollection(data))
    if (result.meta.requestStatus === 'fulfilled') {
      router.push(routes.MY_COLLECTIONS)
    }
  })

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <CollectionForm
      onSubmit={handleFormSubmit}
      title={intl.formatMessage({ id: 'my-collections-page.create' })}
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
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 1 }}
                alignItems="flex-start"
                key={item.id}
              >
                <Input
                  label={intl.formatMessage({
                    id: 'my-collections-page.name',
                  })}
                  error={errors.fields?.[index]?.name?.message}
                  {...register(`fields.${index}.name`)}
                />

                <Controller
                  render={({ field }) => (
                    <Select fullWidth {...field}>
                      {fieldTypes.map((it) => (
                        <MenuItem key={it} value={it}>
                          {intl.formatMessage({
                            id: `my-collections-page.${fieldTypeNames[it]}`,
                          })}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  name={`fields.${index}.fieldType`}
                  control={control}
                />

                <IconButton onClick={() => remove(index)}>
                  <Clear />
                </IconButton>
              </Stack>
            ))
          : undefined}
      </Stack>

      <Button
        variant="contained"
        onClick={() => append(DEFAULT_FIELD)}
        fullWidth
      >
        <FormattedMessage id="my-collections-page.add-field" />
      </Button>
    </CollectionForm>
  )
}

export default CollectionCreate
