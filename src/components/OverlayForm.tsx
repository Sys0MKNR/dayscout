import {
  Checkbox,
  ColorInput,
  Fieldset,
  Flex,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Slider,
  Stack,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core'
import { Controller } from 'react-hook-form'
import { useLoaderData } from 'react-router'
import {
  type Overlay,
  PositionTypes,
  WindowPositionsOptions,
} from '../lib/types'
import { Form, type FormProps } from './Form'
import { StatusItem } from './StatusItem'

const StatusItemNames = ['value', 'icon', 'delta', 'lastUpdated'] as const

export function OverlayForm(props: FormProps<Overlay>) {
  const { form } = props

  const { control } = form
  const { monitors, fonts } = useLoaderData()

  return (
    <Form {...props}>
      <Tabs defaultValue="general">
        <Tabs.List mb={16}>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="appearance">Appearance</Tabs.Tab>
          <Tabs.Tab value="items">Items</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general">
          <Stack>
            <Controller
              name="id"
              control={control}
              render={({ field }) => (
                <TextInput disabled label="ID" {...field} />
              )}
            />
            <Group>
              <Controller
                name="name"
                rules={{ required: true }}
                control={control}
                render={({ field, fieldState }) => (
                  <TextInput
                    style={{ flex: 1 }}
                    label="Name"
                    error={fieldState.error?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="enabled"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    style={{ alignSelf: 'flex-end' }}
                    label="Enabled"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Group>

            <Group align="flex-end" gap={16}>
              <Controller
                name="allMonitors"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="All Monitors"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="monitors"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    label="Monitors"
                    data={monitors}
                    clearable
                    searchable
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Group>

            <Controller
              name="url"
              control={control}
              rules={{ required: 'is required' }}
              render={({ field, fieldState }) => (
                <TextInput
                  label="URL"
                  placeholder="https://example.com"
                  error={fieldState.error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="token"
              control={control}
              render={({ field }) => (
                <TextInput
                  label="Token"
                  placeholder="Your API token"
                  {...field}
                />
              )}
            />
            <Controller
              name="fetchInterval"
              control={control}
              render={({ field, fieldState }) => (
                <NumberInput
                  min={1}
                  label="Fetch Interval (s)"
                  placeholder="Fetch interval in seconds"
                  error={fieldState.error?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Fieldset legend="Thresholds">
              <Group>
                <Controller
                  name="thresholds.high"
                  control={control}
                  render={({ field }) => (
                    <NumberInput label="High" {...field} />
                  )}
                  rules={{ max: 1000 }}
                />
                <Controller
                  name="thresholds.low"
                  control={control}
                  render={({ field }) => <NumberInput label="Low" {...field} />}
                  rules={{ max: 1000 }}
                />
                <Controller
                  name="thresholds.targetBottom"
                  control={control}
                  render={({ field }) => (
                    <NumberInput label="Target Bottom" {...field} />
                  )}
                  rules={{ max: 1000 }}
                />
                <Controller
                  name="thresholds.targetTop"
                  control={control}
                  render={({ field }) => (
                    <NumberInput label="Target Top" {...field} />
                  )}
                  rules={{ max: 1000 }}
                />
              </Group>
            </Fieldset>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="appearance">
          <Stack gap={32} align="flex-start" justify="flex-start">
            <Group align="center">
              <Controller
                name="width"
                control={control}
                rules={{ min: 1 }}
                render={({ field, fieldState }) => (
                  <NumberInput
                    label="Width"
                    placeholder="Width in pixels"
                    error={fieldState.error?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="height"
                control={control}
                render={({ field, fieldState }) => (
                  <NumberInput
                    label="Height"
                    placeholder="Height in pixels"
                    error={fieldState.error?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="padding"
                control={control}
                render={({ field, fieldState }) => (
                  <NumberInput
                    label="Padding"
                    placeholder="Padding in pixels"
                    min={0}
                    step={1}
                    error={fieldState.error?.message}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Group>

            <Controller
              name="font"
              control={control}
              render={({ field, fieldState }) => (
                <Select
                  label="Font"
                  data={fonts}
                  placeholder="Select a font"
                  searchable
                  error={fieldState.error?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Group>
              <Text fw={500} size="sm">
                Opacity
              </Text>
              <Controller
                name="opacity"
                control={control}
                render={({ field }) => (
                  <Slider
                    w={300}
                    min={0}
                    max={100}
                    step={1}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 25, label: '25%' },
                      { value: 50, label: '50%' },
                      { value: 75, label: '75%' },
                      { value: 100, label: '100%' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Group>
            <Fieldset legend="Colors">
              <Group align="end">
                <Controller
                  name="colors.urgent"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ColorInput
                      label="Urgent"
                      format="hex"
                      error={fieldState.error?.message}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="colors.warn"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ColorInput
                      label="Warn"
                      format="hex"
                      error={fieldState.error?.message}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="colors.ok"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ColorInput
                      label="Ok"
                      format="hex"
                      error={fieldState.error?.message}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="colors.background"
                  control={control}
                  render={({ field, fieldState }) => (
                    <ColorInput
                      label="Background"
                      format="hex"
                      error={fieldState.error?.message}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="transparent"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      label="Transparent"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Group>
            </Fieldset>

            <Group>
              <Controller
                name="interactive"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label="Interactive"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Group>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Tabs
                  defaultValue={field.value}
                  variant="pills"
                  orientation="vertical"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <Tabs.List mr={32}>
                    {PositionTypes.map((p) => (
                      <Tabs.Tab key={p} value={p}>
                        {p}
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                  <Tabs.Panel value="Preset">
                    <Controller
                      name="presetPosition"
                      control={control}
                      render={({ field: presetField, fieldState }) => (
                        <Select
                          label="Preset Position"
                          data={WindowPositionsOptions}
                          placeholder="Select a preset position"
                          value={presetField.value}
                          onChange={presetField.onChange}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </Tabs.Panel>
                  <Tabs.Panel value="Custom">
                    <Group>
                      <Controller
                        name="customPosition.x"
                        control={control}
                        render={({ field, fieldState }) => (
                          <NumberInput
                            label="Custom X Position"
                            placeholder="X position in pixels"
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                      <Controller
                        name="customPosition.y"
                        control={control}
                        render={({ field, fieldState }) => (
                          <NumberInput
                            label="Custom Y Position"
                            placeholder="Y position in pixels"
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                          />
                        )}
                      />
                    </Group>
                  </Tabs.Panel>
                </Tabs>
              )}
            />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="items">
          <Flex gap={16} wrap="wrap" justify={'space-between'}>
            {StatusItemNames.map((name) => (
              <StatusItem key={name} name={name} control={control} />
            ))}
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </Form>
  )
}
