import {
  ActionIcon,
  Box,
  Fieldset,
  Group,
  ScrollArea,
  Tooltip,
} from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import {
  IconCopy,
  IconDeviceFloppy,
  IconRestore,
  IconTrash,
} from '@tabler/icons-react'

export interface FormActionsProps {
  copy?: () => void
  remove?: () => void
  reset?: boolean | (() => void)
  save?: boolean | (() => void)
}

export interface FormProps<T> {
  form: UseFormReturnType<T>
  formActions?: FormActionsProps
  children: React.ReactNode
  legend?: string
  onSubmit: (values: T) => void
}

export function Form<T>(props: FormProps<T>) {
  const { form, formActions, legend, onSubmit } = props

  const {
    copy,
    remove,
    reset = () => form.reset(),
    save = true,
  } = formActions || {}

  const resetHandler = typeof reset === 'function' ? reset : () => form.reset()

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Box>
        <Group
          style={{
            background: 'var(--mantine-primary-color-filled)',
            justifyContent: 'flex-end',
            position: 'fixed',
            bottom: 'var(--mantine-spacing-md)',
            right: 'var(--mantine-spacing-md)',
            zIndex: 100,
            padding: 'var(--mantine-spacing-xs)',
            borderRadius: 'var(--mantine-radius-lg)',
          }}
        >
          {copy && (
            <Tooltip label="Copy" color="var(--mantine-primary-color-filled)">
              <ActionIcon aria-label="Copy" variant="filled" onClick={copy}>
                <IconCopy />
              </ActionIcon>
            </Tooltip>
          )}

          {remove && (
            <Tooltip
              label="Delete"
              color="var(--mantine-primary-color-filled)"
              onClick={remove}
            >
              <ActionIcon aria-label="Delete" variant="filled">
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          )}

          {reset && (
            <Tooltip
              label="Reset"
              color="var(--mantine-primary-color-filled)"
              onClick={resetHandler}
            >
              <ActionIcon aria-label="Reset" variant="filled">
                <IconRestore />
              </ActionIcon>
            </Tooltip>
          )}

          {save && (
            <Tooltip label="Save" color="var(--mantine-primary-color-filled)">
              <ActionIcon aria-label="Save" type="submit" variant="filled">
                <IconDeviceFloppy />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
        <Fieldset legend={legend}>
          <ScrollArea
            style={{
              minHeight: '100%',
            }}
            offsetScrollbars={true}
          >
            {props.children}
          </ScrollArea>
        </Fieldset>
      </Box>
    </form>
  )
}
