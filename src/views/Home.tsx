import { Navbar } from '@comp/Navbar'
import { ActionIcon, AppShell, Group, Stack, Text } from '@mantine/core'
import { IconChevronUpRight, IconRefresh } from '@tabler/icons-react'
import { Link, Outlet } from 'react-router-dom'

export function HomeView() {
  return (
    <AppShell header={{ height: 90 }} padding="md">
      <AppShell.Header>
        <Navbar />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet></Outlet>
      </AppShell.Main>
    </AppShell>
  )
}
