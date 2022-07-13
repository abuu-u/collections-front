import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Input from 'common/input'
import {
  ChangeEventHandler,
  ComponentType,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'
import { searchTagsByText, selectTags } from './item-slice'
import { tagSchema } from './item-validation'

interface Properties {
  onAdd: (tag: string) => void
}

const SEARCH_TAGS_COUNT = 10

const TagCreator: ComponentType<Properties> = ({ onAdd }) => {
  const intl = useIntl()

  const {
    register,
    getValues,
    trigger,
    setValue,
    control,
    reset,
    resetField,
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

  const handleTagChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event_) => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      dispatch(
        searchTagsByText({
          str: event_.currentTarget.value,
          count: SEARCH_TAGS_COUNT,
        }),
      )
    }, 1000)
  }

  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (isValid && isAdding) {
      onAdd(getValues().value)
      reset()
      setIsAdding(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdding, getValues, isValid, reset])

  const handleAdd = () => {
    clearTimeout(timeout.current)
    trigger()
    setIsAdding(true)
  }

  return (
    <Stack direction="row" spacing={1} mb={1} alignItems="flex-start">
      <Controller
        name="value"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={options}
            freeSolo
            fullWidth
            renderInput={(parameters) => (
              <Input
                label={intl.formatMessage({
                  id: 'item.tag',
                })}
                sx={{ mb: 2 }}
                {...parameters}
                error={errors.value?.message}
                onChange={(event_) => {
                  field.onChange(event_)
                  handleTagChange(event_)
                }}
              />
            )}
          />
        )}
      />
      <Button variant="contained" size="large" onClick={handleAdd}>
        <FormattedMessage id="item.add" />
      </Button>
    </Stack>
  )
}

export default TagCreator
