import { IconPlus } from '@tabler/icons-react'
import {
  TableOptions,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
  createColumnHelper,
} from '@tanstack/react-table'
import { useEffect, useRef } from 'react'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    edit: boolean
  }
}

interface TableProps<T> {
  options: Omit<TableOptions<T>, 'getCoreRowModel'>
  edit?: boolean
}

const columnHelper = createColumnHelper()

const Columns = [
  columnHelper.display({
    id: '_selector',
    header: ({ table }) => {
      return (
        <input
          type="checkbox"
          className="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
        />
      )
    },
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    footer: () => (
      <button className="btn btn-ghost btn-sm btn-square">
        <IconPlus />
      </button>
    ),
  }),
]

// const addEditColumn = (column: any) => {

export function Table<T>(props: TableProps<T>) {
  const { options, edit = true } = props

  const { columns, ...rest } = options

  let cols = edit ? [].concat(Columns as any, columns as any) : columns

  // if (edit) {

  // }

  const table = useReactTable({
    columns: cols,
    ...rest,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: () => {},
      edit,
    },
  })

  return (
    <div className="overflow-x-auto">
      <table className="table bg-base-100">
        <thead className="text-2xl">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  )
}
