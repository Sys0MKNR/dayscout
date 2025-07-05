import { Button, Checkbox, Fieldset, Group, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { appDataDir } from '@tauri-apps/api/path'
import { openPath } from '@tauri-apps/plugin-opener'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { Form } from '../../components/Form'
import { initSettings, settings } from '../../lib/settings'
import { GeneralSchema, type IGeneralSchema } from '../../lib/types'

export function SettingsView() {
  const query = useQuery({
    queryKey: ['settings'],
    queryFn: () => settings.general.get(),
    retry: 1,
  })

  const form = useForm<IGeneralSchema>({
    mode: 'uncontrolled',
    validate: zod4Resolver(GeneralSchema),
  })

  const mutation = useMutation({
    mutationFn: (values: IGeneralSchema) => {
      return settings.general.set(values)
    },
  })

  const queryClient = useQueryClient()

  const reloadSettings = async (reset: boolean = false) => {
    if (reset) {
      await settings.reset()
    } else {
      await settings.reload()
    }

    try {
      await initSettings()
    } catch (error) {
      console.error('Failed to initialize settings:', error)
      return notifications.show({
        title: 'Error',
        message:
          'Failed to initialize settings. Please check the console for details.',
        color: 'red',
        autoClose: false,
        withCloseButton: true,
      })
    }

    if (reset) {
      notifications.show({
        title: 'Settings Reset',
        message: 'Settings have been reset to default values.',
        color: 'green',
      })
    } else {
      notifications.show({
        title: 'Settings Reloaded',
        message: 'Settings have been reloaded successfully.',
        color: 'green',
      })
    }

    queryClient.clear()
    const newData = await query.refetch()

    if (newData.data) {
      form.setValues(newData.data)
      form.resetDirty(newData.data)
    }
  }

  return (
    <>
      <Form form={form} query={query} mutation={mutation as any}>
        <Fieldset legend="General">
          <Stack>
            <Checkbox
              label="Quit program on close"
              key={form.key('quitOnClose')}
              {...form.getInputProps('quitOnClose', { type: 'checkbox' })}
            />
            <Checkbox
              label="Start program on Startup"
              key={form.key('startOnStartup')}
              {...form.getInputProps('startOnStartup', { type: 'checkbox' })}
            />
            <Checkbox
              label="Only show overlays on startup"
              key={form.key('onlyOverlaysOnStart')}
              {...form.getInputProps('onlyOverlaysOnStart', {
                type: 'checkbox',
              })}
            />
          </Stack>
        </Fieldset>

        <Fieldset
          legend="Advanced"
          style={{ borderColor: 'var(--mantine-color-red-outline)' }}
        >
          <Group>
            <Button
              variant="outline"
              onClick={async () => {
                const dir = await appDataDir()
                await openPath(dir)
              }}
            >
              Open Settings Folder
            </Button>
            <Button variant="outline" onClick={() => reloadSettings(false)}>
              Reload Settings File
            </Button>
            <Button
              color="red"
              variant="filled"
              onClick={() => reloadSettings(true)}
            >
              Reset Settings
            </Button>
          </Group>
        </Fieldset>
      </Form>
    </>
  )
}
