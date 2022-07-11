import Pagination from '@mui/material/Pagination'
import { ComponentType, useEffect } from 'react'
import { usePaging } from 'shared/hooks/use-paging'

interface Properties {
  pagesCount: number
  onChange?: (parameters: { page: number; count: number }) => void
}

const CustomPagination: ComponentType<Properties> = ({
  pagesCount,
  onChange,
}) => {
  const { page, count, changePage } = usePaging(pagesCount)

  useEffect(() => {
    if (page && count) {
      onChange?.({ page, count })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, count])

  return (
    <Pagination
      count={pagesCount}
      page={page ?? 0}
      onChange={(_, value) => changePage(value)}
    />
  )
}

export default CustomPagination
