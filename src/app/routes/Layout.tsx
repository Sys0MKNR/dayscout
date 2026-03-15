import { AppShell } from '@mantine/core'
import { Outlet } from 'react-router'
import { Navbar } from '../components/Navbar'

export function Layout() {
  return (
    <AppShell header={{ height: 48 }} padding="md">
      <AppShell.Header>
        <Navbar />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
