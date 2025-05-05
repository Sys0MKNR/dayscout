import { MantineTableCellProps, useEdit } from '@/hooks/useEdit'
import { Center, Checkbox } from '@mantine/core'

export function EditCheckbox<T extends object>(
  props: MantineTableCellProps<T>
) {
  const { value, handleOnChange, handleBlur } = useEdit(props)
  return (
    <Center>
      <Checkbox
        checked={value as boolean}
        onBlur={handleBlur}
        onChange={(e) => handleOnChange(e.currentTarget.checked)}
      />
    </Center>
  )
}
