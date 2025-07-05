import {
  ActionIcon,
  Box,
  Fieldset,
  Group,
  LoadingOverlay,
  Text,
  Tooltip,
} from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconRestore,
  IconTrash,
} from '@tabler/icons-react'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'

export interface FormActionsProps {
  back?: boolean | (() => void)
  remove?: () => void
  reset?: boolean | (() => void)
  save?: boolean | (() => void)
}

export interface FormProps<T> {
  form: UseFormReturnType<T>
  formActions?: FormActionsProps
  children?: React.ReactNode
  legend?: string
  query: UseQueryResult<T | null | undefined, Error>
  mutation: UseMutationResult<void, Error, T, unknown>
  saveAlwaysEnabled?: boolean
}

export function Form<T>(props: FormProps<T>) {
  const {
    form,
    formActions,
    legend,
    query,
    mutation,
    saveAlwaysEnabled = false,
  } = props

  const {
    back = true,
    remove,
    reset = () => form.reset(),
    save = true,
  } = formActions || {}

  const navigate = useNavigate()

  const resetHandler = typeof reset === 'function' ? reset : () => form.reset()
  const backHandler = typeof back === 'function' ? back : () => navigate(-1)

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
        await mutation.mutateAsync(values)
      } catch (_) {
        notifications.update({
          id,
          color: 'red',
          title: 'Error',
          message: mutation.error?.toString(),
          loading: false,
          autoClose: 2000,
          withCloseButton: true,
        })
        return
      }
      const newData = await query.refetch()

      if (newData.data) {
        form.setValues(newData.data)
        form.resetDirty(newData.data)
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
    [query, mutation, form],
  )

  if (query.error) return <Text c="red">{query.error.toString()}</Text>

  return (
    <form
      onSubmit={form.onSubmit(onSubmit)}
      style={{
        maxHeight:
          'calc(100vh - var(--app-shell-header-offset) - var(--app-shell-padding) * 2)',
        overflow: 'auto',
      }}
    >
      <Box pos="relative">
        <LoadingOverlay
          transitionProps={{ transition: 'fade', duration: 300 }}
          visible={query.isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Fieldset
          disabled={mutation.isPending}
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
            {back && (
              <Tooltip
                label="Back"
                color="var(--mantine-primary-color-filled)"
                onClick={backHandler}
              >
                <ActionIcon aria-label="Back" variant="filled">
                  <IconArrowLeft />
                </ActionIcon>
              </Tooltip>
            )}

            {remove && (
              <Tooltip label="Delete" onClick={remove}>
                <ActionIcon radius={'xs'} aria-label="Delete" variant="filled">
                  <IconTrash color="var(--mantine-color-red-outline)" />
                </ActionIcon>
              </Tooltip>
            )}

            {reset && (
              <Tooltip
                label="Reset"
                color="var(--mantine-primary-color-filled)"
                onClick={resetHandler}
              >
                <ActionIcon
                  aria-label="Reset"
                  variant="filled"
                  disabled={form.isDirty() === false || mutation.isPending}
                >
                  <IconRestore />
                </ActionIcon>
              </Tooltip>
            )}

            {save && (
              <Tooltip label="Save" color="var(--mantine-primary-color-filled)">
                <ActionIcon
                  aria-label="Save"
                  type="submit"
                  variant="filled"
                  disabled={
                    mutation.isPending ||
                    (!saveAlwaysEnabled && form.isDirty() === false)
                  }
                >
                  <IconDeviceFloppy />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Fieldset>
        <Fieldset legend={legend} bd={0}>
          {props.children}
        </Fieldset>
      </Box>
    </form>
  )
}
