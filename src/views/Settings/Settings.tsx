import { Button, Checkbox, Fieldset, Group, Stack } from '@mantine/core'
import { appDataDir } from '@tauri-apps/api/path'
import { openPath } from '@tauri-apps/plugin-opener'
import { Controller, useForm } from 'react-hook-form'
import { useLoaderData } from 'react-router'
import { Form } from '../../components/Form'
import { setSettings } from '../../lib/api'
import type { Settings } from '../../lib/types'

export function SettingsView() {
  const { settings } = useLoaderData()

  const form = useForm<Settings>({
    mode: 'onSubmit',
    defaultValues: settings,
  })

  const { control } = form

  // const reloadSettings = async (reset: boolean = false) => {
  //   if (reset) {
  //     await settings.reset()
  //   } else {
  //     await settings.reload()
  //   }

  //   try {
  //     await initSettings()
  //   } catch (error) {
  //     console.error('Failed to initialize settings:', error)
  //     return notifications.show({
  //       title: 'Error',
  //       message:
  //         'Failed to initialize settings. Please check the console for details.',
  //       color: 'red',
  //       autoClose: false,
  //       withCloseButton: true,
  //     })
  //   }

  //   if (reset) {
  //     notifications.show({
  //       title: 'Settings Reset',
  //       message: 'Settings have been reset to default values.',
  //       color: 'green',
  //     })
  //   } else {
  //     notifications.show({
  //       title: 'Settings Reloaded',
  //       message: 'Settings have been reloaded successfully.',
  //       color: 'green',
  //     })
  //   }

  //   queryClient.clear()
  //   const newData = await query.refetch()

  //   if (newData.data) {
  //     form.setValues(newData.data)
  //     form.resetDirty(newData.data)
  //   }
  // }

  return (
    <Form form={form} onSubmit={setSettings}>
      <Fieldset legend="General">
        <Stack>
          <Controller
            name="quitOnClose"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Quit program on close"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="startOnStartup"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Start program on Startup"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="onlyOverlaysOnStart"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Only show overlays on startup"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
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
          {/* <Button variant="outline" onClick={() => reloadSettings(false)}>
            Reload Settings File
          </Button>
          <Button
            color="red"
            variant="filled"
            onClick={() => reloadSettings(true)}
          >
            Reset Settings
          </Button> */}
        </Group>
      </Fieldset>
    </Form>
  )
}
