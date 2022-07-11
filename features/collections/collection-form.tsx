import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { red } from '@mui/material/colors'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Input from 'common/input'
import MainLayout from 'common/layout/main-layout'
import { NextLinkComposed } from 'common/link'
import Loading from 'common/loading'
import { useUser } from 'features/auth/use-user'
import {
  selectCollectionError,
  selectCollectionImageUrl,
  selectCollectionStatus,
  upladCollectionImage,
} from 'features/collections/collection-slice'
import Image from 'next/image'
import {
  ChangeEventHandler,
  ComponentType,
  FormEventHandler,
  PropsWithChildren,
} from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { EditCollectionData } from 'shared/apis/collections-api'
import { routes } from 'shared/constants/routes'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'
import { Locales } from 'shared/localization/locales'
import { topics } from 'shared/localization/topics'

type UseFormType = UseFormReturn<EditCollectionData>
export type CollectionFormRegister = UseFormType['register']
export type CollectionFormErrors = UseFormType['formState']['errors']
export type CollectionFormControl = UseFormType['control']

interface Properties {
  onSubmit: FormEventHandler<HTMLFormElement>
  title: string
  register: CollectionFormRegister
  errors: CollectionFormErrors
  control: CollectionFormControl
  isClient: boolean
}

const CollectionForm: ComponentType<PropsWithChildren<Properties>> = ({
  onSubmit,
  title,
  children,
  register,
  errors,
  control,
  isClient,
}) => {
  useUser()

  const intl = useIntl()

  const status = useAppSelector(selectCollectionStatus)
  const error = useAppSelector(selectCollectionError)
  const imageUrl = useAppSelector(selectCollectionImageUrl)

  const dispatch = useAppDispatch()

  const handleImgUpload: ChangeEventHandler<HTMLInputElement> = (event_) => {
    const file = event_.target.files?.[0]
    if (file) {
      dispatch(upladCollectionImage(file))
    }
  }

  return (
    <MainLayout>
      <Loading open={status === 'loading'} />
      <Typography component="h1" variant="h4" textAlign="center" mb="20px">
        {title}
      </Typography>

      <Box
        sx={{
          maxWidth: 500,
          m: 'auto',
        }}
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

        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <Typography variant="body1" textAlign="center" mb="20px">
            <FormattedMessage id="my-collections-page.img" />
          </Typography>

          {imageUrl ? (
            <Box
              sx={{
                width: '100%',
                height: '200px',
                position: 'relative',
              }}
            >
              <Image
                src={imageUrl}
                alt="Collection image"
                layout="fill"
                objectFit="cover"
              />
            </Box>
          ) : undefined}

          <label htmlFor="img">
            <input
              style={{ display: 'none' }}
              accept="image/*"
              id="img"
              type="file"
              onChange={handleImgUpload}
            />
            <Button fullWidth variant="contained" component="span">
              Upload
            </Button>
          </label>

          <Stack direction="column" spacing={1} sx={{ mb: 1 }}>
            <Input
              label={intl.formatMessage({ id: 'my-collections-page.name' })}
              error={errors.name?.message}
              fullWidth
              {...register('name')}
            />

            <Input
              label={intl.formatMessage({
                id: 'my-collections-page.description',
              })}
              multiline
              minRows={2}
              maxRows={10}
              error={errors.description?.message}
              fullWidth
              {...register('description')}
            />

            {isClient ? (
              <Controller
                render={({ field }) => (
                  <Select fullWidth {...field}>
                    {Object.entries(topics[intl.locale as Locales]).map(
                      ([key, value]) => (
                        <MenuItem key={key} value={key}>
                          {value}
                        </MenuItem>
                      ),
                    )}
                  </Select>
                )}
                name={'topicId'}
                control={control}
              />
            ) : undefined}
          </Stack>

          <Typography variant="body1" textAlign="center" mb="20px">
            <FormattedMessage id="my-collections-page.fields" />
          </Typography>

          {children}

          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Button variant="contained" type="submit">
              {title}
            </Button>

            <Button
              component={NextLinkComposed}
              to={routes.MY_COLLECTIONS}
              variant="outlined"
            >
              <FormattedMessage id="my-collections-page.cancel" />
            </Button>
          </Stack>
        </Stack>
      </Box>
    </MainLayout>
  )
}

export default CollectionForm
