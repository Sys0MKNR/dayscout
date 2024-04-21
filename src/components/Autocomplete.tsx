//./components/Autocomplete.tsx

import { IconEdit, IconTrash, IconTrashFilled } from '@tabler/icons-react'
import classNames from 'classnames'
import { KeyboardEvent, useCallback, useLayoutEffect, useMemo } from 'react'
import { useRef, useState } from 'react'

type Props = {
  items: string[]
  placeholder?: string
  onChange?(val: string): void
  createNew?: boolean
  onNew?(val: string): void
  className?: classNames.Argument
}

export default function Autocomplete(props: Props) {
  const {
    items,
    onChange: onChangeParent,
    placeholder = 'Type something..',
    createNew = false,
    onNew,
    className,
  } = props
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState('')

  const filtered = useMemo(() => {
    return items.filter((item) => {
      return item.toLowerCase().includes(value.toLowerCase())
    })
  }, [value])

  const onChange = useCallback(
    (val: string) => {
      setValue(val)
      onChangeParent?.(val)
    },
    [onChangeParent]
  )

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNew?.(value)
      setOpen(false)
    }
  }

  const createNewItem =
    createNew && value.length > 0 && !filtered.includes(value)

  return (
    <div
      className={classNames(
        'dropdown',

        className
      )}
      ref={ref}
    >
      <input
        type="text"
        className="input input-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        tabIndex={0}
      />
      <ul className="w-full z-50 dropdown-content rounded-box menu max-h-96 overflow-auto flex-col bg-base-100 border border-base-content/10">
        {createNewItem && (
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
            <li key={index} tabIndex={0}>
              <div>
                <button
                  className="border-b border-b-base-content/10 rounded-box w-full p-2 cursor-pointer hover:bg-base-200"
                  onClick={() => {
                    onChange(item)
                    setOpen(false)
                  }}
                >
                  {item}
                </button>

                <div className="flex">
                  <IconTrashFilled
                    className="hover:opacity-85"
                    size={'1em'}
                  ></IconTrashFilled>
                  <IconEdit
                    className="hover:opacity-85"
                    size={'1em'}
                  ></IconEdit>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
