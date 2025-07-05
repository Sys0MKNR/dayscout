import { Checkbox, Group, NumberInput, Paper, Text } from '@mantine/core'
import type { IOverlaySchema } from '../lib/types'
import type { FormProps } from './Form'

export interface StatusItemsProps {
  name: keyof IOverlaySchema['statusItems']
  form: FormProps<IOverlaySchema>['form']
}

export function StatusItem(props: StatusItemsProps) {
  const { form, name } = props

  const inputProps = form.getInputProps(`statusItems.${name}.enabled`, {
    type: 'checkbox',
  })

  return (
    <Paper withBorder p={16} radius={'md'} w={300}>
      <Group wrap="nowrap" align="center" justify="space-between">
        <Group
          style={{
            flexGrow: 1,
          }}
        >
          <Checkbox
            bd="0"
            key={form.key(`statusItems.${name}.enabled`)}
            {...inputProps}
            onChange={(e) => {
              inputProps.onChange(e)
            }}
          />

          <Text size="lg">{name}</Text>
        </Group>

        <NumberInput
          label="Size"
          key={form.key(`statusItems.${name}.size`)}
          {...form.getInputProps(`statusItems.${name}.size`)}
          min={0}
          max={100}
          step={1}
          size="xs"
          w={64}
        />
      </Group>
    </Paper>
  )
}
