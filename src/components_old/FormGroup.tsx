interface FormGroupProps {
  children: React.ReactNode
  name?: string
  className?: string
}

export function FormGroup(props: FormGroupProps) {
  return (
    <fieldset
      className={`border border-solid border-primary p-4 mb-4 flex flex-row flex-wrap gap-2 ${props.className || ''}`}
    >
      <legend className="text-xl">{props.name}</legend>
      {props.children}
    </fieldset>
  )
}
