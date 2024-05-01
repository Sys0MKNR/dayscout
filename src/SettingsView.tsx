import Navbar from '@comp/Navbar'

import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from '@comp/Breadcrumps'
import { settings } from './state/settings'
import { ReactNode, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { setWindowTheme } from './lib/utils'

const SettingsProvider = (props: { children: ReactNode }) => {
  const snap = useSnapshot(settings.state)

  useEffect(() => {
    settings.init()
    return settings.state.unsubscribe
  }, [])

  useEffect(() => {
    const profiles = settings.state.data.profile

    if (profiles.length <= 0) {
      return
    }

    const profile = profiles[0]

    setWindowTheme(profile.appearance.theme)
  }, [settings.state.data.profile])

  if (!snap.ready) {
    return null
  }

  return props.children
}

function SettingsView() {
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

export default SettingsView
