import classNames from 'classnames'
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputContainerProps {
  children: ReactNode
  className?: string
  label?: string
}

export function InputContainer(props: InputContainerProps) {
  return (
    <div className={classNames('join w-full', props.className)}>
      {props.label && (
        <label className="join-item input input-bordered input-sm label">
          {props.label}
        </label>
      )}

      {props.children}
    </div>
  )
}

interface UseInputProps {
  name?: string
  placeholder?: string
  container?: Record<string, any>
  input?: Record<string, any>
}

export function useInput(props: UseInputProps) {
  const { register } = useFormContext()
  const formProps = props.name ? register(props.name) : {}
  const label = props.placeholder || props.name || ''

  return {
    containerProps: {
      label,
      ...props.container,
    },
    inputProps: {
      ...formProps,
      ...props.input,
    },
  }
}

interface InputProps {
  name?: string
  label?: string
  container?: Record<string, any>
}

interface TextInputProps extends InputProps {
  input?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
}

export function TextInput(props: TextInputProps) {
  const { containerProps, inputProps } = useInput(props)

  return (
    <InputContainer {...containerProps}>
      <input
        {...inputProps}
        className="join-item input input-bordered input-sm w-full"
      />
    </InputContainer>
  )
}

interface SelectInputProps extends InputProps {
  input?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
  children: ReactNode
}

export function SelectInput(props: SelectInputProps) {
  const { containerProps, inputProps } = useInput(props)
  return (
    <InputContainer {...containerProps}>
      <select
        className="select select-bordered w-full join-item select-sm"
        {...inputProps}
      >
        {props.children}
      </select>
    </InputContainer>
  )
}

interface CheckBoxInputProps extends InputProps {
  input?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
  children: ReactNode
}

export function CheckBoxInput(props: CheckBoxInputProps) {
  const { containerProps, inputProps } = useInput(props)

  const { watch } = useFormContext()

  const watchCheck = watch(props.name as any, Boolean(inputProps.defaultValue))

  return (
    <InputContainer {...containerProps}>
      const watchCheck = watch(props.name as any, Boolean(props.defaultValue))
      <input
        {...inputProps}
        checked={Boolean(watchCheck)}
        className="toggle join-item toggle-lg"
        type="checkbox"
      />
    </InputContainer>
  )
}
