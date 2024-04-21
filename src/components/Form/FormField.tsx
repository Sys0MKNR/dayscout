import { NestedKeyOf } from '@/lib/utils'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from 'react'
import { useFormContext } from 'react-hook-form'

const DefaultInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register } = useFormContext()

  return (
    <input
      {...props}
      {...register(props.name as any)}
      className="input input-bordered input-sm w-full"
    />
  )
}

const CheckBoxInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register, watch } = useFormContext()

  const watchCheck = watch(props.name as any, Boolean(props.defaultValue))

  return (
    <input
      {...props}
      {...register(props.name as any)}
      checked={Boolean(watchCheck)}
      className="toggle"
      type="checkbox"
    />
  )
}

const PasswordInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register } = useFormContext()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="join w-full">
      <input
        {...props}
        {...register(props.name as any)}
        type={showPassword ? 'text' : 'password'}
        className="input input-bordered w-full input-sm join-item"
      />
      <button
        className="btn btn-square swap btn-sm join-item rounded-r-full"
        type="button"
        onClick={() => setShowPassword((p) => !p)}
      >
        {showPassword ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  )
}

const ColorInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register } = useFormContext()

  return (
    <input
      {...props}
      {...register(props.name as any)}
      className="btn btn-sm"
      type="color"
    />
  )
}

const SelectInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) => {
  const { register } = useFormContext()

  return (
    <select
      {...props}
      {...register(props.name as any)}
      className="select select-bordered select-sm"
    >
      <option disabled>{props.placeholder}</option>
      {props.children}
    </select>
  )
}

const RangeInputElement = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  const { register } = useFormContext()

  return (
    <input
      {...props}
      {...register(props.name as any)}
      className="range range-sm m-1"
      type="range"
    />
  )
}

function getInputElement(type: string) {
  switch (type) {
    case 'password':
      return PasswordInputElement
    case 'checkbox':
      return CheckBoxInputElement
    case 'color':
      return ColorInputElement
    case 'select':
      return SelectInputElement
    case 'range':
      return RangeInputElement
    default:
      return DefaultInputElement
  }
}

export interface FormFieldOptionGroup<T extends object> {
  name: string
  children: FormFieldOptions<T>[]
}

export interface FormFieldOptions<T extends object> {
  name: NestedKeyOf<T>
  label?: string
  placeholder?: string
  value?: string
  type?: string
  width?: string
  opts?: any
  children?: ReactNode
  customProps?: Record<string, any>
  stacked?: boolean
  className?: string
}

interface FormFieldProps<T extends object> {
  item: FormFieldOptions<T>
}

export function FormField<T extends object>(props: FormFieldProps<T>) {
  const { item } = props
  const {
    name,
    label,
    placeholder,
    value,
    type = 'text',
    children,
    customProps,
    stacked = true,
    className,
  } = item

  const Input = getInputElement(type)

  const orientation = stacked ? 'flex-col' : 'items-center'

  const margin = stacked ? '' : 'mr-2'

  return (
    <div
      className={`${
        item.width || 'w-full'
      } px-4 flex ${orientation} ${className || ''}`}
    >
      <label htmlFor={name} className={`label ${margin}`}>
        <span className="label-text text-base min-h-6">{label || name}</span>
      </label>

      <Input
        name={name}
        type={type}
        placeholder={placeholder || name}
        defaultValue={value}
        children={children}
        {...customProps}
      />
    </div>
  )
}
