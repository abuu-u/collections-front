import { ExpandMore } from '@mui/icons-material'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import MainLayout from 'common/layout/main-layout'
import { NextLinkComposed } from 'common/link'
import Loading from 'common/loading'
import {
  getCollections,
  getItems,
  getTags,
  reset,
  selectHomeCollections,
  selectHomeItems,
  selectHomeStatus,
  selectHomeTags,
} from 'features/home/home-slice'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { routes } from 'shared/constants/routes'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'

const MOST_USED_TAGS_COUNT = 10
const LATEST_ITEMS_COUNT = 10
const LARGEST_COLLECTIONS_COUNT = 5

const Home: NextPage = () => {
  const dispatch = useAppDispatch()

  const status = useAppSelector(selectHomeStatus)
  const tags = useAppSelector(selectHomeTags)
  const items = useAppSelector(selectHomeItems)
  const collections = useAppSelector(selectHomeCollections)

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const [isTagsCoudExpanded, setIsTagsCoudExpanded] = useState(false)

  useEffect(() => {
    setIsTagsCoudExpanded(matches)
  }, [matches])

  useEffect(() => {
    dispatch(getTags({ count: MOST_USED_TAGS_COUNT }))
    dispatch(getItems({ count: LATEST_ITEMS_COUNT }))
    dispatch(getCollections(LARGEST_COLLECTIONS_COUNT))
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainLayout>
      <Loading open={status === 'loading'} />

      <Typography component="h1" variant="h4" textAlign="center" mb="30px">
        <FormattedMessage id="main-page.header" />
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row-reverse' }}
        spacing={4}
        alignItems="flex-start"
      >
        <Box width={{ xs: '100%', sm: '300px' }}>
          <Accordion
            expanded={isTagsCoudExpanded}
            onClick={() => setIsTagsCoudExpanded(!isTagsCoudExpanded)}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="tags-content"
              id="tags-header"
            >
              <Typography component="h2">
                <FormattedMessage id="main-page.tags" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" flexWrap="wrap" alignItems="flex-start">
                {tags.map((item, index) => (
                  <Chip
                    sx={{ margin: 1 }}
                    key={index}
                    label={item}
                    component={NextLinkComposed}
                    to={`${routes.SEARCH}?searchString=${item}`}
                    clickable
                  />
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Stack spacing={4} flexGrow={1}>
          <Typography component="h2" variant="h6">
            <FormattedMessage id="main-page.lastest-items" />
          </Typography>

          <Stack spacing={2} alignItems="flex-start">
            {items.map((it) => (
              <Stack spacing={0} key={it.id} alignItems="flex-start">
                <Typography
                  component={NextLinkComposed}
                  to={`${routes.ITEMS}/${it.id}`}
                >
                  {it.name}
                </Typography>

                <Typography>
                  <FormattedMessage id="main-page.collection" />
                  {': '}
                  {it.collection.name}
                </Typography>

                <Typography>
                  <FormattedMessage id="main-page.author" />
                  {': '}
                  {it.collection.owner.name}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Typography component="h2" variant="h6">
            <FormattedMessage id="main-page.largest-collections" />
          </Typography>

          <Stack spacing={1} alignItems="flex-start">
            {collections.map((it) => (
              <Typography
                key={it.id}
                component={NextLinkComposed}
                to={`${routes.COLLECTIONS}/${it.id}`}
              >
                {it.name}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </MainLayout>
  )
}

export default Home
