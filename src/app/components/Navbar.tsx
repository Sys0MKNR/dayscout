import { ActionIcon, Flex, Group, Text, Tooltip } from '@mantine/core'
import { IconArrowLeft, IconSettings } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { Link, type UIMatch, useMatches, useNavigate, useParams } from 'react-router'
import { ReloadIcon } from './ReloadIcon'

interface Handle {
  crumb: (data: any, params: any) => ReactNode
}

export function Navbar() {
  const params = useParams()

  const matches = useMatches() as UIMatch<unknown, Handle>[]
  const currentMatch = matches[matches.length - 1]

  const crumb = currentMatch?.handle?.crumb || ''
  const label = typeof crumb === 'string' ? crumb : crumb(currentMatch.loaderData, params)

  const navigate = useNavigate()

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
        <ActionIcon
          style={{
            visibility: currentMatch.id === 'index' ? 'hidden' : 'visible',
          }}
          variant="filled"
          aria-label="Back"
          onClick={() => navigate('/', { viewTransition: true })}
        >
          <IconArrowLeft />
        </ActionIcon>

        <Text size="xl" fw={'bolder'}>
          {label}
        </Text>

        <Group>
          <Tooltip label="Settings">
            <ActionIcon
              component={Link}
              to={'/settings'}
              variant="filled"
              aria-label="Settings"
              viewTransition
            >
              <IconSettings />
            </ActionIcon>
          </Tooltip>

          <ReloadIcon />
        </Group>
      </Group>
    </Flex>
  )
}
