import {
  Group,
  ActionIcon,
  Text,
  Breadcrumbs,
  Flex,
  Anchor,
} from '@mantine/core'
import { IconChevronUpRight, IconRefresh } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { Link, UIMatch, useMatches, useParams } from 'react-router-dom'

interface Handle {
  crumb: (data: any, params: any) => ReactNode
}

export function Navbar() {
  const params = useParams()

  const matches = useMatches() as UIMatch<any, Handle>[]
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => {
      const c = match.handle.crumb
      const label = typeof c === 'string' ? c : c(match.data, params)

      return (
        <Anchor component={Link} key={match.id} to={match.pathname}>
          {label}
        </Anchor>
      )
    })

  return (
    <Flex
      style={{
        height: '100%',
        justifyContent: 'space-between',
        flexDirection: 'column',
      }}
    >
      <Group
        h="60"
        bg="var(--mantine-primary-color-filled)"
        px="md"
        justify="space-between"
        align="center"
      >
        <Group>
          <Anchor component={Link} to={'/'} c="gray.2">
            <Text size="xl">Home</Text>
          </Anchor>
          <Anchor component={Link} to={'/settings'} c="gray.2">
            <Text size="xl">Settings</Text>
          </Anchor>
        </Group>
        <Group>
          <ActionIcon variant="filled" aria-label="Show">
            <IconChevronUpRight />
          </ActionIcon>

          <ActionIcon variant="filled" aria-label="Reload">
            <IconRefresh />
          </ActionIcon>
        </Group>
      </Group>
      <Flex
        style={{
          flexGrow: 1,
        }}
        px="md"
        bg="dark.9"
        align={'center'}
      >
        <Breadcrumbs>{crumbs}</Breadcrumbs>
      </Flex>
    </Flex>
  )
}
