import { yupResolver } from '@hookform/resolvers/yup'
import { Check, Clear, ThumbUp, ThumbUpOutlined } from '@mui/icons-material'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Input from 'common/input'
import MainLayout from 'common/layout/main-layout'
import { NextLinkComposed } from 'common/link'
import Loading from 'common/loading'
import { selectName } from 'features/auth/auth-slice'
import { commentSchema } from 'features/items/item-validation'
import {
  createItemComment,
  getItemById,
  getItemComments,
  likeOrUnlike,
  reset,
  selectItem,
  selectItemComments,
  selectItemError,
  selectItemStatus,
} from 'features/items/items-slice'
import type { NextPage } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { FieldType } from 'shared/apis/collections-api'
import { routes } from 'shared/constants/routes'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'

const Item: NextPage = () => {
  const router = useRouter()

  const intl = useIntl()

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<{ text: string }>({
    defaultValues: {
      text: '',
    },
    resolver: yupResolver(commentSchema),
    reValidateMode: 'onSubmit',
  })

  const handleComponentAdd = handleSubmit((data) => {
    dispatch(createItemComment({ data, itemId: Number(router.query.id) }))
    resetForm()
  })

  const dispatch = useAppDispatch()

  const status = useAppSelector(selectItemStatus)
  const error = useAppSelector(selectItemError)
  const comments = useAppSelector(selectItemComments)
  const item = useAppSelector(selectItem)

  const name = useAppSelector(selectName)

  useEffect(() => {
    if (error?.status === 401) {
      router.push(routes.LOGIN)
    }
  }, [error?.status, router])

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isNotFound, setIsNotFound] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  useEffect(() => {
    let fetchCommentsInterval: NodeJS.Timer
    const id = router.query.id
    if (id !== undefined) {
      const itemId = Number(id)
      if (!Number.isNaN(itemId)) {
        dispatch(getItemById(itemId))
        fetchCommentsInterval = setInterval(
          () => dispatch(getItemComments(itemId)),
          5000,
        )
      } else {
        setIsNotFound(true)
      }
    }
    return () => {
      clearInterval(fetchCommentsInterval)
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
    <MainLayout maxWidth="sm">
      <Loading open={status === 'loading'} />

      <Typography component="h1" variant="h4" textAlign="center" mb="20px">
        {item.name}
      </Typography>

      {item.fields.map((field) => {
        switch (field.fieldType) {
          case FieldType.Bool:
            const bool = item.boolValues.find(
              (value) => value.fieldId === field.id,
            )
            return (
              <Typography key={field.id} display="flex" alignItems="center">
                {field.name}
                {': '}
                {bool?.value ? <Check /> : <Clear />}
              </Typography>
            )

          case FieldType.String || FieldType.MultiLineString:
            const string = item.stringValues.find(
              (value) => value.fieldId === field.id,
            )
            return (
              <Typography
                key={field.id}
              >{`${field.name}: ${string?.value}`}</Typography>
            )

          case FieldType.Int:
            const int = item.intValues.find(
              (value) => value.fieldId === field.id,
            )
            return (
              <Typography
                key={field.id}
              >{`${field.name}: ${int?.value}`}</Typography>
            )

          case FieldType.DateTime:
            const dateTime = item.dateTimeValues.find(
              (value) => value.fieldId === field.id,
            )
            return (
              <Typography
                key={field.id}
              >{`${field.name}: ${dateTime?.value}`}</Typography>
            )
        }
      })}

      <Typography>
        <FormattedMessage id="main-page.tags" />:
        {item.tags.map((item, index) => (
          <Chip
            sx={{ margin: 1 }}
            key={index}
            label={item}
            component={NextLinkComposed}
            to={`${routes.SEARCH}?searchString=${item}`}
            clickable
          />
        ))}
      </Typography>

      <Typography alignItems="center" display="flex">
        <FormattedMessage id="main-page.likes" />
        {': '}
        {item.likesCount}
        {'  '}
        <IconButton
          onClick={() => {
            dispatch(likeOrUnlike(Number(router.query.id)))
          }}
        >
          {item.like ? <ThumbUp /> : <ThumbUpOutlined />}
        </IconButton>
      </Typography>

      <Typography component="h2" variant="h5" textAlign="center" my="20px">
        <FormattedMessage id="item-page.comments" />
      </Typography>

      {name ? (
        <>
          <Typography mb="10px">
            <FormattedMessage id="item-page.leave-a-comment" />
          </Typography>

          <form onSubmit={handleComponentAdd}>
            <Input
              label={intl.formatMessage({ id: 'item-page.comment' })}
              fullWidth
              multiline
              minRows={2}
              maxRows={10}
              {...register('text')}
              error={errors.text?.message}
            />

            <Button type="submit" variant="contained" sx={{ mt: 1 }}>
              <FormattedMessage id="item-page.add" />
            </Button>
          </form>
        </>
      ) : undefined}

      {comments.map((comment, index) => {
        return (
          <Stack key={index} my="20px">
            <Typography variant="h6">{comment.author?.name}:</Typography>
            <Typography sx={{ wordBreak: 'break-all' }}>
              {comment.text}
            </Typography>
          </Stack>
        )
      })}
    </MainLayout>
  )
}

export default Item
