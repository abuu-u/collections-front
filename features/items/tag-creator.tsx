import { yupResolver } from '@hookform/resolvers/yup'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Input from 'common/input'
import { ItemCreateFields } from 'pages/collections/[id]/items/[...slug]'
import { ComponentType, useEffect, useRef, useState } from 'react'
import { Controller, UseFieldArrayAppend, useForm } from 'react-hook-form'
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
    getValues,
    trigger,
    control,
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

  const handleTagChange = (data: string) => {
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      dispatch(
        searchTagsByText({
          str: data,
          count: SEARCH_TAGS_COUNT,
        }),
      )
    }, 1000)
  }

  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (isValid && isAdding) {
      append({ value: getValues().value })
      reset()
      setIsAdding(false)
    }
  }, [isAdding, getValues, isValid, reset, append])

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
        render={({ field: { onChange, ref, value, ...field } }) => (
          <Autocomplete
            value={{ label: value }}
            options={options}
            fullWidth
            freeSolo
            filterOptions={(x) => x}
            onChange={(_, data) => {
              onChange((data as { label: string })?.label)
            }}
            onInputChange={(_, data) => handleTagChange(data)}
            renderInput={(parameters) => (
              <Input
                {...field}
                label={intl.formatMessage({
                  id: 'item.tag',
                })}
                sx={{ mb: 2 }}
                inputRef={ref}
                {...parameters}
                error={errors.value?.message}
                onChange={onChange}
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
