import { Checkbox, Group, NumberInput, Paper, Text } from '@mantine/core'
import { type Control, Controller } from 'react-hook-form'
import type { IOverlaySchema } from '../lib/types'

export interface StatusItemProps {
  name: keyof IOverlaySchema['statusItems']
  control: Control<IOverlaySchema>
}

export function StatusItem({ name, control }: StatusItemProps) {
  return (
    <Paper withBorder p={16} radius={'md'} w={300}>
      <Group wrap="nowrap" align="center" justify="space-between">
        <Group style={{ flexGrow: 1 }}>
          <Controller
            name={`statusItems.${name}.enabled`}
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={field.onChange} />
            )}
          />
          <Text size="lg">{name}</Text>
        </Group>
        <Controller
          name={`statusItems.${name}.size`}
          control={control}
          render={({ field }) => (
            <NumberInput
              label="Size"
              {...field}
              min={0}
              max={100}
              step={1}
              size="xs"
              w={64}
            />
          )}
        />
      </Group>
    </Paper>
  )
}
