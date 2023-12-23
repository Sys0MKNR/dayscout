//./components/Autocomplete.tsx

import classNames from 'classnames'
import { useMemo } from 'react'
import { useRef, useState } from 'react'

type Props = {
  items: string[]
  value: string
  placeholder?: string
  onChange(val: string): void
  showNew?: boolean
  onNew?(val: string): void
}

export default function Autocomplete(props: Props) {
  const {
    items,
    value,
    onChange,
    placeholder = 'Type something..',
    showNew = false,
    onNew,
  } = props
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const filtered = useMemo(() => {
    return items.filter((item) => {
      return item.toLowerCase().includes(value.toLowerCase())
    })
  }, [value])

  const showNewItem = showNew && value.length > 0 && !filtered.includes(value)

  return (
    <div
      className={classNames({
        'dropdown w-full': true,
        'dropdown-open': open,
      })}
      ref={ref}
    >
      <input
        type="text"
        className="input input-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        tabIndex={0}
      />
      <ul
        tabIndex={0}
        className="z-50 dropdown-content rounded-box menu max-h-96 overflow-auto flex-col bg-base-100 border border-base-content/10"
        style={{ width: ref.current?.clientWidth }}
      >
        {showNewItem && (
          <li
            tabIndex={0}
            onClick={() => {
              onNew?.(value)
              onChange(value)
              setOpen(false)
            }}
            className="border-b border-b-base-content/10 rounded-box w-full p-2 cursor-pointer hover:bg-base-200"
          >
            New: {value}
          </li>
        )}

        {filtered.map((item, index) => {
          return (
            <li
              key={index}
              tabIndex={index + 2}
              onClick={() => {
                onChange(item)
                setOpen(false)
              }}
              className="border-b border-b-base-content/10 rounded-box w-full p-2 cursor-pointer hover:bg-base-200"
            >
              {item}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
