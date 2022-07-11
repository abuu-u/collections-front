import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import CustomPagination from 'common/custom-pagination'
import MainLayout from 'common/layout/main-layout'
import Link from 'common/link'
import Loading from 'common/loading'
import {
  reset,
  searchCollectionsThunk,
  searchItemsThunk,
  selectFoundCollections,
  selectFoundCollectionsPagesCount,
  selectFoundItems,
  selectFoundItemsPagesCount,
  selectSearchError,
  selectSearchStatus,
} from 'features/search/search-slice'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { routes } from 'shared/constants/routes'
import { usePaging } from 'shared/hooks/use-paging'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'

const Search: NextPage = () => {
  const dispatch = useAppDispatch()

  const router = useRouter()

  const status = useAppSelector(selectSearchStatus)
  const error = useAppSelector(selectSearchError)
  const foundItems = useAppSelector(selectFoundItems)
  const foundItemsPagesCount = useAppSelector(selectFoundItemsPagesCount)
  const foundCollections = useAppSelector(selectFoundCollections)
  const foundCollectionsPagesCount = useAppSelector(
    selectFoundCollectionsPagesCount,
  )

  const [tab, setTab] = useState('items')
  const { page, count } = usePaging(
    tab === 'items' ? foundItemsPagesCount : foundCollectionsPagesCount,
  )

  const handleTabChange = (_: any, newPage: string) => {
    setTab(newPage)
  }

  useEffect(() => {
    if (page && count) {
      if (tab === 'items') {
        dispatch(
          searchItemsThunk({
            page,
            count,
            searchString: router.query.searchString as string,
          }),
        )
      } else {
        dispatch(
          searchCollectionsThunk({
            page,
            count,
            searchString: router.query.searchString as string,
          }),
        )
      }
    }
  }, [tab, page, count, dispatch, router.query.searchString])

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainLayout maxWidth="md">
      <Loading open={status === 'loading'} />

      <Box
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        mb="20px"
        mt="-20px"
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab
            label={<FormattedMessage id="search-page.items" />}
            value="items"
          />

          <Tab
            label={<FormattedMessage id="search-page.collections" />}
            value="collections"
          />
        </Tabs>
      </Box>

      <Typography component="h1" variant="h4" textAlign="center" mb="20px">
        <FormattedMessage id={`search-page.${tab}`} />
      </Typography>

      <Stack mb="20px">
        {(tab === 'items' ? foundItems : foundCollections).map((it) => (
          <Link
            key={it.id}
            href={`${tab === 'items' ? routes.ITEMS : routes.COLLECTIONS}/${
              it.id
            }`}
          >
            {it.name}
          </Link>
        ))}
      </Stack>

      <CustomPagination
        pagesCount={
          tab === 'items' ? foundItemsPagesCount : foundCollectionsPagesCount
        }
      />
    </MainLayout>
  )
}

export default Search
