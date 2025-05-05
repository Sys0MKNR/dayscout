import { IWindowSchema } from '@/types/window'
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table'
import { useMemo } from 'react'

const data: IWindowSchema[] = [
  { id: '1', name: 'Window 1', profile: '1', monitor: '1', enabled: true },
  { id: '2', name: 'Window 2', profile: '2', monitor: '2', enabled: true },
  { id: '3', name: 'Window 3', profile: '3', monitor: '3', enabled: true },
]

export function WindowsView() {
  const columns = useMemo<MRT_ColumnDef<IWindowSchema>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'profile',
        header: 'Profile',
      },
      {
        accessorKey: 'monitor',
        header: 'Display',
      },
      {
        accessorKey: 'enabled',
        header: 'Enabled',
      },
    ],
    []
  )

  //pass table options to useMantineReactTable
  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableColumnActions: false,
    enableRowActions: true,
    enableToolbarInternalActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    enableGlobalFilter: false,
  })

  return <MantineReactTable table={table} />
}
