import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export type Parameters = {
  page: string
  count: string
}

const DEFAULT_PAGE = 1
const DEFAULT_COUNT = 10

const parseStringToNumber = (parameter: string) => {
  const number = Number.parseInt(parameter)
  return Number.isNaN(number) ? undefined : number
}

export const usePaging = (pagesCount: number) => {
  const router = useRouter()

  const [page, setPage] = useState<number>()
  const [count, setCount] = useState<number>()

  const changePage = (to: number) => {
    router.push({ query: { ...router.query, page: to } }, undefined, {
      shallow: true,
    })
  }

  useEffect(() => {
    if (router.isReady) {
      const { page: pageString, count: countString } =
        router.query as Parameters

      const parsedPage = parseStringToNumber(pageString)
      const parsedCount = parseStringToNumber(countString)

      const query: Record<string, number> = {}

      if (parsedPage === undefined) {
        query.page = DEFAULT_PAGE
      } else if (parsedPage > pagesCount && pagesCount > 0) {
        query.page = pagesCount
      } else if (parsedPage < 1) {
        query.page = DEFAULT_PAGE
      } else {
        setPage(parsedPage)
      }

      if (parsedCount === undefined) {
        query.count = DEFAULT_COUNT
      } else if (parsedCount < 1) {
        query.page = DEFAULT_COUNT
      } else {
        setCount(parsedCount)
      }

      if (Object.values(query).length > 0) {
        router.replace({ query: { ...router.query, ...query } }, undefined, {
          shallow: true,
        })
      }
    }
  }, [router.query, router.isReady, router, pagesCount])

  return { page, count, changePage }
}
