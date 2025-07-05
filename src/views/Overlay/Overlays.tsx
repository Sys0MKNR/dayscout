import {
  ActionIcon,
  Anchor,
  Box,
  Card,
  Center,
  Flex,
  LoadingOverlay,
  Menu,
} from '@mantine/core'
import {
  IconCheck,
  IconDotsVertical,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { settings } from '../../lib/settings'

export function OverlaysView() {
  const query = useQuery({
    queryKey: ['overlays'],
    queryFn: () => settings.overlays.get(),
  })

  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const items = useMemo(() => {
    if (!query.data) return []

    return query.data.map((o) => (
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        key={o.id}
        w={250}
        style={{
          borderColor: o.enabled
            ? 'var(--mantine-primary-color-filled)'
            : 'transparent',
          borderWidth: '2px',
          borderStyle: 'solid',
          position: 'relative',
        }}
      >
        <Center>
          <Anchor size="xl" component={Link} to={`/overlay/${o.id}`}>
            {o.name}
          </Anchor>
        </Center>
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon variant="transparent">
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={async () => {
                  await settings.overlays.setOne({
                    id: o.id,
                    enabled: !o.enabled,
                  })
                  queryClient.invalidateQueries({ queryKey: ['overlays'] })
                }}
                leftSection={
                  o.enabled ? <IconX size={14} /> : <IconCheck size={14} />
                }
              >
                {o.enabled ? 'Disable' : 'Enable'}
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={async () => {
                  await settings.overlays.removeOne(o.id)
                  queryClient.invalidateQueries({ queryKey: ['overlays'] })
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </Card>
    ))
  }, [query.data, queryClient])

  return (
    <Box pos="relative">
      <LoadingOverlay visible={query.isLoading} />
      <Flex gap={'lg'}>{items}</Flex>
      <ActionIcon
        style={{
          background: 'var(--mantine-primary-color-filled)',
          position: 'fixed',
          bottom: 'var(--mantine-spacing-md)',
          right: 'var(--mantine-spacing-md)',
          zIndex: 100,
          padding: 'var(--mantine-spacing-xs)',
          borderRadius: 'var(--mantine-radius-lg)',
        }}
        size="48"
        variant="filled"
        onClick={() => navigate('/overlay/new')}
      >
        <IconPlus />
      </ActionIcon>
    </Box>
  )
}
