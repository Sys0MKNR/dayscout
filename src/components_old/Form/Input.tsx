import classNames from 'classnames'
import { ReactNode } from 'react'

interface InputProps {
  children: ReactNode
  className?: string
  label?: string | ReactNode
  name?: string
}

export function Input(props: InputProps) {
  return (
    <div className={classNames('join w-full', props.className)}>
      {props.label && (
        <label className="input input-bordered join-item input-sm w-24">
          {props.label}
        </label>
      )}

      {props.children}
    </div>
  )
}

export function TextInput(props: InputProps) {
  return (
    <Input {...props}>
      <input
        className="input input-bordered join-item input-sm w-full"
        type="text"
        autoComplete="off"
        {...props}
      />
    </Input>
  )
}
