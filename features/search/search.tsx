import SearchIcon from '@mui/icons-material/Search'
import InputBase from '@mui/material/InputBase'
import { alpha, styled } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { FormEventHandler, useRef } from 'react'
import { useIntl } from 'react-intl'
import { routes } from 'shared/constants/routes'

const SearchForm = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(1),
  width: 'auto',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '12ch',
    '&:focus': {
      width: '20ch',
    },
  },
}))

const Search = () => {
  const intl = useIntl()

  const router = useRouter()

  const searchReference = useRef<HTMLInputElement>()

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event_) => {
    event_.preventDefault()
    if (searchReference.current) {
      router.push(
        `${routes.SEARCH}?searchString=${searchReference.current.value}`,
      )
    }
  }

  return (
    <SearchForm onSubmit={handleSubmit}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      {router.isReady ? (
        <StyledInputBase
          inputRef={searchReference}
          defaultValue={router.query.searchString}
          placeholder={intl.formatMessage({ id: 'search.placeholder' })}
          inputProps={{ 'aria-label': 'search' }}
        />
      ) : undefined}
    </SearchForm>
  )
}
export default Search
