import { ActionIcon, Anchor, Box, Card, Center, Flex, Menu } from '@mantine/core'
import { IconCheck, IconDotsVertical, IconPlus, IconTrash, IconX } from '@tabler/icons-react'
import { useMemo } from 'react'
import { Link, RouteObject, useFetcher, useLoaderData, useNavigate } from 'react-router'
import { api } from '../../lib/api'

export const IndexRoute = {
  index: true,
  element: <IndexView />,
  id: 'index',
  handle: {
    crumb: 'Overlays',
  },
  loader: async () => {
    return {
      overlays: await api.overlay.list(),
    }
  },
} satisfies RouteObject

function IndexView() {
  const { overlays } = useLoaderData<typeof IndexRoute.loader>()

  let fetcher = useFetcher()
  const navigate = useNavigate()

  const items = useMemo(() => {
    return overlays.map((o) => (
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        key={o.id}
        w={250}
        style={{
          borderColor: o.enabled ? 'var(--mantine-primary-color-filled)' : 'transparent',
          borderWidth: '2px',
          borderStyle: 'solid',
          position: 'relative',
        }}
      >
        <Center>
          <Anchor size="xl" component={Link} to={`/overlay/${o.id}`} viewTransition>
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
                onClick={() => {
                  fetcher.submit(
                    {
                      enabled: (!o.enabled).toString(),
                    },
                    {
                      method: 'post',
                      action: `/overlay/${o.id}/enabled`,
                    },
                  )
                }}
                leftSection={o.enabled ? <IconX size={14} /> : <IconCheck size={14} />}
              >
                {o.enabled ? 'Disable' : 'Enable'}
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={async () => {
                  fetcher.submit(
                    {},
                    {
                      method: 'post',
                      action: `/overlay/${o.id}/delete`,
                    },
                  )
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </Card>
    ))
  }, [overlays, fetcher])

  return (
    <Box pos="relative">
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
        onClick={() => navigate('/overlay/new', { viewTransition: true })}
      >
        <IconPlus />
      </ActionIcon>
    </Box>
  )
}
