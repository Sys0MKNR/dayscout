import { settings } from '@/state/settings'
import { GeneralSchema, IGeneralSchema } from '@/types/settings'

import { useSnapshot } from 'valtio'
import { useForm } from '@mantine/form'

import { zodResolver } from 'mantine-form-zod-resolver'
import { Checkbox, Select, Stack, TextInput } from '@mantine/core'
import { Form } from '@comp/Forms'

export function GeneralSettingsView() {
  const snap = useSnapshot(settings.state.data)

  const form = useForm<IGeneralSchema>({
    mode: 'uncontrolled',
    initialValues: snap.general,
    validate: zodResolver(GeneralSchema),
  })

  // const onValid = useOnValid(form, (values) => {
  //   settings.state.data.general = Object.assign(
  //     settings.state.data.general,
  //     values
  //   )
  // })

  return (
    <Form form={form} onSubmit={(v) => console.log(JSON.stringify(v))}>
      <Stack>
        <TextInput
          key={form.key('theme')}
          {...form.getInputProps('theme')}
        ></TextInput>
        <Select></Select>
        <Select></Select>
        <Checkbox
          label="Quit program on close"
          key={form.key('quitOnClose')}
          {...form.getInputProps('quitOnClose', { type: 'checkbox' })}
        />
        <Checkbox
          label="Start program on Pc Startup"
          key={form.key('startOnStartup')}
          {...form.getInputProps('startOnStartup', { type: 'checkbox' })}
        />
      </Stack>
    </Form>
  )
}
