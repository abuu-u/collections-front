import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColumns } from '@mui/x-data-grid'
import MainLayout from 'common/layout/main-layout'
import {
  blockUsers,
  DEFAULT_USERS_FETCH_COUNT,
  deleteSelectedUsers,
  demoteUsers,
  getAllUsers,
  promoteUsers,
  reset,
  selectAdminStatus,
  selectUsers,
  selectUsersCount,
  unblockUsers,
} from 'features/admin/admin-slice'
import { useUser } from 'features/auth/use-user'
import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useAppDispatch, useAppSelector } from 'shared/lib/store'

const Admin: NextPage = () => {
  useUser()

  const intl = useIntl()

  const dispatch = useAppDispatch()

  const users = useAppSelector(selectUsers)
  const usersCount = useAppSelector(selectUsersCount)
  const status = useAppSelector(selectAdminStatus)

  const selectedRows = useRef<number[]>([])

  const columns: GridColumns = [
    { field: 'id', sortable: false, headerName: 'ID', width: 60 },
    {
      field: 'name',
      sortable: false,
      headerName: intl.formatMessage({ id: 'users-grid.name' }),
      width: 180,
    },
    {
      field: 'email',
      sortable: false,
      headerName: intl.formatMessage({ id: 'users-grid.email' }),
      width: 180,
    },
    {
      field: 'status',
      sortable: false,
      headerName: intl.formatMessage({ id: 'users-grid.status' }),
      width: 80,
      type: 'boolean',
    },
    {
      field: 'admin',
      sortable: false,
      headerName: intl.formatMessage({ id: 'users-grid.admin' }),
      width: 80,
      type: 'boolean',
    },
  ]

  useEffect(() => {
    dispatch(getAllUsers())
    return () => {
      dispatch(reset())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainLayout>
      <Typography component="h1" variant="h4" textAlign="center" mb="20px">
        <FormattedMessage id="users-page.header" />
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button
          size="small"
          onClick={() => dispatch(blockUsers({ ids: selectedRows.current }))}
        >
          <FormattedMessage id="users-page.block-users" />
        </Button>
        <Button
          size="small"
          onClick={() => dispatch(unblockUsers({ ids: selectedRows.current }))}
        >
          <FormattedMessage id="users-page.unblock-users" />
        </Button>
        <Button
          size="small"
          onClick={() => dispatch(promoteUsers({ ids: selectedRows.current }))}
        >
          <FormattedMessage id="users-page.promote-users" />
        </Button>
        <Button
          size="small"
          onClick={() => dispatch(demoteUsers({ ids: selectedRows.current }))}
        >
          <FormattedMessage id="users-page.demote-users" />
        </Button>
        <Button
          size="small"
          onClick={() =>
            dispatch(deleteSelectedUsers({ ids: selectedRows.current }))
          }
        >
          <FormattedMessage id="users-page.delete-selected-users" />
        </Button>
      </Stack>

      <DataGrid
        rows={users}
        rowCount={usersCount}
        columns={columns}
        autoHeight
        pageSize={DEFAULT_USERS_FETCH_COUNT}
        paginationMode="server"
        onPageChange={(page) => {
          dispatch(getAllUsers({ page: page + 1 }))
        }}
        onSelectionModelChange={(selectionModel) =>
          (selectedRows.current = selectionModel.map((it) =>
            Number.parseInt(it.toString()),
          ))
        }
        rowsPerPageOptions={[DEFAULT_USERS_FETCH_COUNT]}
        loading={status === 'loading'}
        disableColumnFilter
        disableColumnMenu
        checkboxSelection
        disableSelectionOnClick
      />
    </MainLayout>
  )
}

export default Admin
