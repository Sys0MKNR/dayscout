import classNames from 'classnames'
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputContainerProps {
  children: ReactNode
  className?: string
}

export function InputContainer(props: InputContainerProps) {
  return (
    <div className={classNames('join w-full', props.className)}>
      <label className="join-item input input-bordered input-sm label">
        Enabled
      </label>

      {props.children}
    </div>
  )
}

interface TextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  container?: Record<string, any>
}

export function TextInput(props: TextInputProps) {
  const { register } = useFormContext()

  const formProps = props.name ? register(props.name) : {}

  return (
    <InputContainer>
      <input
        {...formProps}
        {...props}
        className="join-item input input-bordered input-sm w-full"
      />
    </InputContainer>
  )
}

interface SelectInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  container?: Record<string, any>
}

export function SelectInput(props: SelectInputProps) {
  const { register } = useFormContext()

  const formProps = props.name ? register(props.name) : {}

  return (
    <InputContainer>
      <select
        className="select select-bordered w-full join-item select-sm"
        {...formProps}
        {...props}
      >
        {props.children}
      </select>
    </InputContainer>
  )
}
