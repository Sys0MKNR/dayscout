import {
  ActionIcon,
  Box,
  Fieldset,
  Group,
  LoadingOverlay,
  Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconRestore,
  IconTrash,
} from '@tabler/icons-react'
import { useCallback } from 'react'

import type { FieldValues, UseFormReturn } from 'react-hook-form'

export interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  children?: React.ReactNode
  legend?: string
  saveAlwaysEnabled?: boolean
  onSubmit: (values: T) => Promise<void>
  onBack?: () => void
  onRemove?: () => void
  onReset?: () => void
  loading?: boolean
  saving?: boolean
}

export function Form<T extends FieldValues>(props: FormProps<T>) {
  console.log('render Form')

  const {
    form,
    legend,
    saveAlwaysEnabled = false,
    onBack,
    onRemove,
    onReset,
    loading = false,
    saving = false,
  } = props

  console.log(form.formState.errors)

  const onSubmit = useCallback(
    async (values: T) => {
      const id = notifications.show({
        loading: true,
        title: 'Saving...',
        message: '',
        autoClose: false,
        withCloseButton: false,
      })
      try {
        await props.onSubmit(values)
      } catch (e) {
        console.error('Error saving form:', e)
        notifications.update({
          id,
          color: 'red',
          title: 'Error',
          message: e.toString(),
          loading: false,
          autoClose: 2000,
          withCloseButton: true,
        })
        return
      }

      notifications.update({
        id,
        color: 'green',
        title: 'Saved',
        message: '',
        loading: false,
        autoClose: 2000,
        withCloseButton: true,
      })
    },
    [props.onSubmit],
  )

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      style={{
        maxHeight:
          'calc(100vh - var(--app-shell-header-offset) - var(--app-shell-padding) * 2)',
        overflow: 'auto',
      }}
      autoComplete="off"
    >
      <Box pos="relative">
        <LoadingOverlay
          transitionProps={{ transition: 'fade', duration: 300 }}
          visible={loading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Fieldset
          disabled={saving}
          style={{
            background: 'var(--mantine-primary-color-filled)',
            position: 'fixed',
            bottom: 'var(--mantine-spacing-md)',
            right: 'var(--mantine-spacing-md)',
            zIndex: 100,
            padding: 'var(--mantine-spacing-xs)',
            borderRadius: 'var(--mantine-radius-lg)',
          }}
        >
          <Group
            style={{
              justifyContent: 'flex-end',
            }}
          >
            {onBack && (
              <Tooltip
                label="Back"
                color="var(--mantine-primary-color-filled)"
                onClick={onBack}
              >
                <ActionIcon aria-label="Back" variant="filled">
                  <IconArrowLeft />
                </ActionIcon>
              </Tooltip>
            )}
            {onRemove && (
              <Tooltip label="Delete" onClick={onRemove}>
                <ActionIcon radius={'xs'} aria-label="Delete" variant="filled">
                  <IconTrash color="var(--mantine-color-red-outline)" />
                </ActionIcon>
              </Tooltip>
            )}
            {onReset && (
              <Tooltip
                label="Reset"
                color="var(--mantine-primary-color-filled)"
                onClick={onReset}
              >
                <ActionIcon
                  aria-label="Reset"
                  variant="filled"
                  disabled={form.formState.isDirty === false || saving}
                >
                  <IconRestore />
                </ActionIcon>
              </Tooltip>
            )}

            <Tooltip label="Save" color="var(--mantine-primary-color-filled)">
              <ActionIcon
                aria-label="Save"
                type="submit"
                variant="filled"
                // disabled={
                //   saving || (!saveAlwaysEnabled && form.isDirty() === false)
                // }
              >
                <IconDeviceFloppy />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Fieldset>
        <Fieldset
          legend={legend}
          style={{
            borderColor:
              Object.keys(form.formState.errors).length > 0
                ? 'var(--mantine-color-red-outline)'
                : 'transparent',
          }}
        >
          {props.children}
        </Fieldset>
      </Box>
    </form>
  )
}
