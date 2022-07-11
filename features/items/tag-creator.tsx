import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Input from 'common/input'
import { ItemCreateFields } from 'pages/collections/[id]/items/[...slug]'
import {
  ChangeEvent,
  ComponentType,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { UseFieldArrayAppend, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'
import { searchTagsByText, selectTags } from './item-slice'
import { tagSchema } from './item-validation'

interface Properties {
  append: UseFieldArrayAppend<ItemCreateFields, 'tags'>
}

const SEARCH_TAGS_COUNT = 10

const TagCreator: ComponentType<Properties> = ({ append }) => {
  const intl = useIntl()

  const {
    register,
    getValues,
    trigger,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<{ value: string }>({
    defaultValues: {
      value: '',
    },
    resolver: yupResolver(tagSchema),
  })

  const dispatch = useAppDispatch()
  const options = useAppSelector(selectTags)

  const timeout = useRef<NodeJS.Timeout>()

  const handleTagChange = (
    event_: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    clearTimeout(timeout.current)
    const { value } = event_.currentTarget
    setValue('value', value)
    timeout.current = setTimeout(async () => {
      dispatch(searchTagsByText({ str: value, count: SEARCH_TAGS_COUNT }))
    }, 1000)
  }

  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (isValid && isAdding) {
      append({ value: getValues().value })
      reset({ value: '' })
      setIsAdding(false)
    }
  }, [isAdding, getValues, isValid, append, reset])

  const handleAdd = () => {
    trigger()
    setIsAdding(true)
  }

  const { onChange, ...restRegister } = register('value')

  return (
    <Stack direction="row" spacing={1} mb={1} alignItems="flex-start">
      <Autocomplete
        options={options}
        freeSolo
        fullWidth
        renderInput={({
          InputLabelProps: { onChange, ...restInputLabelProperties },
          ...restParameters
        }) => {
          return (
            <Input
              label={intl.formatMessage({
                id: 'item.tag',
              })}
              onChange={(event_) => {
                onChange?.(event_ as unknown as FormEvent<HTMLLabelElement>)
                handleTagChange(event_)
              }}
              sx={{ mb: 2 }}
              InputLabelProps={restInputLabelProperties}
              {...restParameters}
              {...restRegister}
              error={errors.value?.message}
            />
          )
        }}
      />

      <Button variant="contained" size="large" onClick={handleAdd}>
        <FormattedMessage id="item.add" />
      </Button>
    </Stack>
  )
}

export default TagCreator
