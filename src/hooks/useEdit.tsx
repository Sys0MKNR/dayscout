import {
  MRT_Cell,
  MRT_Column,
  MRT_Row,
  MRT_TableInstance,
} from 'mantine-react-table'
import { useState } from 'react'

export type MantineTableCellProps<TData extends Record<string, any>> = {
  cell: MRT_Cell<TData>
  column: MRT_Column<TData>
  row: MRT_Row<TData>
  table: MRT_TableInstance<TData>
}

export function useEdit<TData extends Record<string, any>>(
  props: MantineTableCellProps<TData>
) {
  const { cell, column, row, table } = props
  const { getState, setEditingCell, setEditingRow, setCreatingRow } = table
  const { editingRow, creatingRow } = getState()

  const [value, setValue] = useState(() => cell.getValue())
  const isCreating = creatingRow?.id === row.id
  const isEditing = editingRow?.id === row.id

  const handleOnChange = (newValue: unknown) => {
    //@ts-expect-error ???
    row._valuesCache[column.id] = newValue
    if (isCreating) setCreatingRow(row)
    else if (isEditing) setEditingRow(row)
    setValue(newValue)
  }

  const handleBlur = () => {
    setEditingCell(null)
  }

  return { value, handleOnChange, handleBlur }
}
