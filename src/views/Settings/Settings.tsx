import Navbar from '@/components_old/Navbar'

import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from '@/components_old/Breadcrumps'
import { settings } from '@/state/settings'
import { setWindowTheme } from '@/lib/utils'
import { ReactNode, useEffect } from 'react'
import { useSnapshot } from 'valtio'

const SettingsProvider = (props: { children: ReactNode }) => {
  const snap = useSnapshot(settings.state)

  const { theme } = snap.data.general

  useEffect(() => {
    settings.init()
    return settings.state.unsubscribe
  }, [])

  useEffect(() => {
    console.log('Profile changed')
    const general = settings.state.data.general

    if (!general) {
      return
    }

    setWindowTheme(general.theme)
  }, [theme])

  if (!snap.ready) {
    return null
  }

  return props.children
}

export function SettingsView() {
  return (
    <div className="h-screen transition-all">
      <Navbar></Navbar>
      <Breadcrumbs />
      <SettingsProvider>
        <main className="flex-1 p-5 h-[calc(100vh-120px)]">
          <Outlet></Outlet>
        </main>
      </SettingsProvider>
    </div>
  )
}
