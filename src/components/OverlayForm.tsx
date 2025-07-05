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
import { useQuery } from '@tanstack/react-query'
import { invoke } from '@tauri-apps/api/core'
import { availableMonitors } from '@tauri-apps/api/window'
import { useEffect, useState } from 'react'
import {
  type IOverlaySchema,
  PositionOptions,
  PositionTypeOptions,
} from '../lib/types'
import { Form, type FormProps } from './Form'
import { StatusItem } from './StatusItem'

const StatusItemNames = ['value', 'icon', 'delta', 'lastUpdated'] as const

export function OverlayForm(props: FormProps<IOverlaySchema>) {
  const { form, query } = props

  const monitorQuery = useQuery({
    queryKey: ['monitors'],
    queryFn: async () => {
      const monitors = await availableMonitors()
      return monitors.map((m, i) => m.name || i.toString())
    },
    initialData: [],
  })

  const fontQuery = useQuery({
    queryKey: ['fonts'],
    queryFn: async () => {
      return await invoke<string[]>('font_families')
    },
    initialData: [],
  })

  const [allMonitors, setAllMonitors] = useState<boolean | undefined>()

  const allMonitorsProps = form.getInputProps('allMonitors', {
    type: 'checkbox',
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: form can be ignored
  useEffect(() => {
    if (!query.data) return
    form.initialize(query.data)
    setAllMonitors(query.data.allMonitors)
  }, [query.data])

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
            <TextInput
              disabled
              label="ID"
              key={form.key('id')}
              {...form.getInputProps('id')}
            />
            <TextInput
              label="Name"
              key={form.key('name')}
              {...form.getInputProps('name')}
            />
            <Checkbox
              label="Enabled"
              key={form.key('enabled')}
              {...form.getInputProps('enabled', { type: 'checkbox' })}
            />

            <Group align="flex-end" gap={16}>
              <Checkbox
                label="All Monitors"
                key={form.key('allMonitors')}
                {...allMonitorsProps}
                onChange={(e) => {
                  setAllMonitors(e.currentTarget.checked)
                  allMonitorsProps.onChange(e)
                }}
              />
              <MultiSelect
                disabled={allMonitors}
                label="Monitors"
                key={form.key('monitors')}
                {...form.getInputProps('monitors')}
                data={monitorQuery.data}
                clearable
                searchable
              />
            </Group>

            <TextInput
              label="URL"
              key={form.key('url')}
              {...form.getInputProps('url')}
              placeholder="https://example.com"
            />
            <TextInput
              label="Token"
              key={form.key('token')}
              {...form.getInputProps('token')}
              placeholder="Your API token"
            />
            <NumberInput
              min={1}
              label="Fetch Interval (ms)"
              key={form.key('fetchInterval')}
              {...form.getInputProps('fetchInterval')}
              placeholder="Fetch interval in milliseconds"
            />

            <Fieldset legend="Thresholds">
              <Group>
                <NumberInput
                  label="High"
                  key={form.key('thresholds.bgHigh')}
                  {...form.getInputProps('thresholds.bgHigh')}
                />
                <NumberInput
                  label="Low"
                  key={form.key('thresholds.bgLow')}
                  {...form.getInputProps('thresholds.bgLow')}
                />
                <NumberInput
                  label="Target Bottom"
                  key={form.key('thresholds.bgTargetBottom')}
                  {...form.getInputProps('thresholds.bgTargetBottom')}
                />
                <NumberInput
                  label="Target Top"
                  key={form.key('thresholds.bgTargetTop')}
                  {...form.getInputProps('thresholds.bgTargetTop')}
                />
              </Group>
            </Fieldset>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="appearance">
          <Stack gap={32} align="flex-start">
            <Group align="center">
              <NumberInput
                label="Width"
                key={form.key('width')}
                {...form.getInputProps('width')}
                placeholder="Width in pixels"
              />
              <NumberInput
                label="Height"
                key={form.key('height')}
                {...form.getInputProps('height')}
                placeholder="Height in pixels"
              />
              <NumberInput
                label="Padding"
                key={form.key('padding')}
                {...form.getInputProps('padding')}
                placeholder="Padding in pixels"
                min={0}
                step={1}
              />
            </Group>

            <Select
              label="Font"
              key={form.key('font')}
              {...form.getInputProps('font')}
              data={fontQuery.data}
              placeholder="Select a font"
              searchable
            />

            <Group>
              <Text fw={500} size="sm">
                Opacity
              </Text>
              <Slider
                w={300}
                defaultValue={1}
                key={form.key('opacity')}
                {...form.getInputProps('opacity')}
                min={0}
                max={1}
                step={0.01}
                marks={[
                  { value: 0, label: '0%' },
                  { value: 0.25, label: '25%' },
                  { value: 0.5, label: '50%' },
                  { value: 0.75, label: '75%' },
                  { value: 1, label: '100%' },
                ]}
              />
            </Group>
            <Fieldset legend="Colors">
              <Group align="end">
                <ColorInput
                  label="Urgent"
                  key={form.key('colors.urgent')}
                  {...form.getInputProps('colors.urgent')}
                  format="hex"
                />
                <ColorInput
                  label="Warn"
                  key={form.key('colors.warn')}
                  {...form.getInputProps('colors.warn')}
                  format="hex"
                />
                <ColorInput
                  label="Ok"
                  key={form.key('colors.ok')}
                  {...form.getInputProps('colors.ok')}
                  format="hex"
                />
                <ColorInput
                  label=" Background"
                  key={form.key('colors.background')}
                  {...form.getInputProps('colors.background')}
                  format="hex"
                />
                <Checkbox
                  label="Transparent"
                  description={null}
                  key={form.key('transparent')}
                  {...form.getInputProps('transparent', { type: 'checkbox' })}
                />
              </Group>
            </Fieldset>

            <Group>
              <Checkbox
                label="Interactive"
                description={null}
                key={form.key('interactive')}
                {...form.getInputProps('interactive', { type: 'checkbox' })}
              />
            </Group>

            <Tabs
              defaultValue="preset"
              variant="pills"
              key={form.key('position')}
              {...form.getInputProps('position')}
            >
              <Tabs.List mb={16}>
                {PositionTypeOptions.map((p) => (
                  <Tabs.Tab key={p.value} value={p.value}>
                    {p.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              <Tabs.Panel value="preset">
                <Select
                  label="Preset Position"
                  key={form.key('presetPosition')}
                  {...form.getInputProps('presetPosition')}
                  data={PositionOptions}
                  placeholder="Select a preset position"
                />
              </Tabs.Panel>

              <Tabs.Panel value="custom">
                <Group>
                  <NumberInput
                    label="Custom X Position"
                    key={form.key('customPosition.x')}
                    {...form.getInputProps('customPosition.x')}
                    placeholder="X position in pixels"
                  />
                  <NumberInput
                    label="Custom Y Position"
                    key={form.key('customPosition.y')}
                    {...form.getInputProps('customPosition.y')}
                    placeholder="Y position in pixels"
                  />
                </Group>
              </Tabs.Panel>
            </Tabs>
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="items">
          <Flex gap={16} wrap="wrap" justify={'space-between'}>
            {StatusItemNames.map((name) => (
              <StatusItem key={name} name={name} form={form} />
            ))}
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </Form>
  )
}
