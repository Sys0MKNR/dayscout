import { CellContext } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

interface Elem {
  onChange: (e: any) => void
  value: string
  onBlur: () => void
}

const ColMap = {
  select: SelectColumn,
  input: InputColumn,
}

interface EditableColProps<TData, TValue> {
  elem?: ((elem: Elem) => React.ReactNode) | keyof typeof ColMap
  ctx: CellContext<TData, TValue>
}

function SelectColumn(props: any) {
  const { children, ...rest } = props
  return (
    <select {...rest} className="select select-ghost w-full max-w-xs">
      {children}
    </select>
  )
}

function InputColumn(props: any) {
  return <input {...props} className="input input-ghost input-sm" />
}

export function Column<TData, TValue>(props: EditableColProps<TData, TValue>) {
  const {
    ctx: {
      getValue,
      row: { index },
      column: { id },
      table,
    },
    elem = 'input',
  } = props

  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const colType = typeof elem === 'string' ? ColMap[elem] : elem

  return colType({
    value: value as string,
    onChange: (e: any) => setValue(e.target.value as any),
    onBlur,
  })
}
