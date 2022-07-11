import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import {
  getGridStringOperators,
  GridColumns,
  GridFilterModel,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import MainLayout from 'common/layout/main-layout'
import { NextLinkComposed } from 'common/link'
import Loading from 'common/loading'
import {
  deleteCollectionItems,
  getCollectionFields,
  getItems,
  reset,
  selectCollectionFields,
  selectCollectionisOwner,
  selectCollectionItems,
  selectCollectionItemsError,
  selectCollectionItemsStatus,
  setFilterName,
  setSortBy,
  setSortFieldId,
} from 'features/collections/collection-items-slice'
import type { NextPage } from 'next'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { FieldType } from 'shared/apis/collections-api'
import { routes } from 'shared/constants/routes'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'

const CollectionItems: NextPage = () => {
  const router = useRouter()

  const intl = useIntl()

  const dispatch = useAppDispatch()

  const status = useAppSelector(selectCollectionItemsStatus)
  const error = useAppSelector(selectCollectionItemsError)
  const data = useAppSelector(selectCollectionItems)
  const fields = useAppSelector(selectCollectionFields)
  const isOwner = useAppSelector(selectCollectionisOwner)

  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length > 0) {
      dispatch(setSortBy(model[0].sort))
      if (model[0].field === 'name') {
        dispatch(setSortFieldId(-1))
      } else {
        dispatch(setSortFieldId(Number(model[0].field)))
      }
    } else {
      dispatch(setSortBy())
      dispatch(setSortFieldId())
    }
    dispatch(getItems(Number(router.query.id)))
  }

  const handleFilterModelChange = (model: GridFilterModel) => {
    dispatch(setFilterName(model.items[0]?.value))
    dispatch(getItems(Number(router.query.id)))
  }

  const columns: GridColumns = [
    {
      field: 'name',
      headerName: intl.formatMessage({ id: 'users-grid.name' }),
      width: 180,
      filterOperators: getGridStringOperators().filter(
        (filter) => filter.value === 'contains',
      ),
      renderCell(parameters) {
        return (
          <NextLinkComposed to={`${routes.ITEMS}/${parameters.id}`}>
            {parameters.value}
          </NextLinkComposed>
        )
      },
    },
    ...(fields
      .filter((field) => {
        return (
          field.fieldType === FieldType.String ||
          field.fieldType === FieldType.DateTime
        )
      })
      .map((field) => {
        return {
          field: field.id.toString(),
          headerName: field.name,
          width: 180,
          filterable: false,
        }
      }) as GridColumns),
  ]

  const selectedRows = useRef<number[]>([])

  const rows = data.map((row) => {
    let stringValuesObject: Record<number, string> = {}
    let dateTimeValuesObject: Record<number, string> = {}

    for (const value of row.stringValues) {
      stringValuesObject[value.fieldId] = value.value
    }

    for (const value of row.dateTimeValues) {
      dateTimeValuesObject[value.fieldId] = value.value
    }

    return {
      id: row.id,
      name: row.name,
      ...stringValuesObject,
      ...dateTimeValuesObject,
    }
  })

  const [selectedRow, setSelectedRow] = useState<number>()

  const [contextMenu, setContextMenu] = useState<
    | {
        mouseX: number
        mouseY: number
      }
    | undefined
  >()

  const handleClose = () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    setContextMenu(undefined)
  }

  const handleContextMenu = (event: MouseEvent) => {
    if (!isOwner) {
      return
    }
    event.preventDefault()
    setSelectedRow(Number((event.currentTarget as HTMLElement)?.dataset.id))
    setContextMenu(
      contextMenu === undefined
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : undefined,
    )
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [isNotFound, setIsNotFound] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  useEffect(() => {
    const id = router.query.id
    if (id !== undefined) {
      const collectionId = Number(id)
      if (!Number.isNaN(collectionId)) {
        dispatch(getItems(collectionId))
        dispatch(getCollectionFields(collectionId))
      } else {
        setIsNotFound(true)
      }
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
    <MainLayout>
      <Loading open={status === 'loading'} />

      <Typography component="h1" variant="h4" textAlign="center" mb="20px">
        <FormattedMessage id="collection-items.header" />
      </Typography>

      {isOwner && isClient ? (
        <Button
          component={NextLinkComposed}
          to={`${routes.COLLECTIONS}/${router.query.id}/items/create`}
          variant="contained"
          fullWidth
          sx={{ mb: 4 }}
        >
          <FormattedMessage id="my-collections-page.create" />
        </Button>
      ) : undefined}

      <DataGrid
        components={{
          Toolbar: () => (
            <GridToolbarContainer>
              {isOwner && (
                <Button
                  size="small"
                  onClick={() =>
                    dispatch(
                      deleteCollectionItems({
                        data: { ids: selectedRows.current },
                        collectionId: Number(router.query.id),
                      }),
                    )
                  }
                >
                  <FormattedMessage id="users-page.delete-selected-users" />
                </Button>
              )}
              <GridToolbarFilterButton />
              <GridToolbarExport />
            </GridToolbarContainer>
          ),
        }}
        rows={rows}
        componentsProps={{
          row: {
            onContextMenu: handleContextMenu,
            style: { cursor: 'context-menu' },
          },
        }}
        columns={columns}
        autoHeight
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
        filterMode="server"
        onFilterModelChange={handleFilterModelChange}
        onSelectionModelChange={(selectionModel) =>
          (selectedRows.current = selectionModel.map((it) =>
            Number.parseInt(it.toString()),
          ))
        }
        loading={status === 'loading'}
        disableColumnMenu
        checkboxSelection={isOwner}
        disableSelectionOnClick
      />

      {isOwner ? (
        <Menu
          open={contextMenu !== undefined}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== undefined
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
        >
          <MenuItem
            component={NextLinkComposed}
            to={`${routes.COLLECTIONS}/${router.query.id}/items/${selectedRow}/edit`}
          >
            Edit
          </MenuItem>
        </Menu>
      ) : undefined}
    </MainLayout>
  )
}

export default CollectionItems
