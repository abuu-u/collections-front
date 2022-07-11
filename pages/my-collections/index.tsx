import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CustomPagination from 'common/custom-pagination'
import MainLayout from 'common/layout/main-layout'
import Link, { NextLinkComposed } from 'common/link'
import Loading from 'common/loading'
import { useUser } from 'features/auth/use-user'
import { reset } from 'features/collections/collection-slice'
import {
  deleteUserCollection,
  getUserCollections,
  selectCollections,
  selectCollectionsPagesCount,
  selectCollectionsStatus,
} from 'features/collections/collections-slice'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { routes } from 'shared/constants/routes'
import { usePaging } from 'shared/hooks/use-paging'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'

const MyCollections: NextPage = () => {
  useUser()

  const dispatch = useAppDispatch()

  const collections = useAppSelector(selectCollections)
  const collectionsPagesCount = useAppSelector(selectCollectionsPagesCount)
  const status = useAppSelector(selectCollectionsStatus)

  const { page, count } = usePaging(collectionsPagesCount)

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainLayout maxWidth="md">
      <Loading open={status === 'loading'} />

      <Typography component="h1" variant="h4" textAlign="center" mb="20px">
        <FormattedMessage id="my-collections-page.header" />
      </Typography>

      <Button
        component={NextLinkComposed}
        to={routes.MY_COLLECTIONS_CREATE}
        variant="contained"
        fullWidth
      >
        <FormattedMessage id="my-collections-page.create" />
      </Button>

      <List>
        {collections.map((collection) => (
          <Stack direction="row" key={collection.id}>
            <Link
              href={`${routes.COLLECTIONS}/${collection.id}`}
              sx={{ mr: 'auto' }}
            >
              {collection.name}
            </Link>

            <Button
              component={NextLinkComposed}
              to={`${routes.MY_COLLECTIONS}/${collection.id}/edit`}
            >
              <FormattedMessage id="my-collections-page.edit" />
            </Button>

            <Button
              onClick={async () => {
                await dispatch(deleteUserCollection(collection.id))
                if (page && count) {
                  dispatch(getUserCollections({ page, count }))
                }
              }}
            >
              <FormattedMessage id="my-collections-page.delete" />
            </Button>
          </Stack>
        ))}
      </List>

      <CustomPagination
        pagesCount={collectionsPagesCount}
        onChange={(data) => {
          dispatch(getUserCollections(data))
        }}
      />
    </MainLayout>
  )
}

export default MyCollections
