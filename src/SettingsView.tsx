import Navbar from '@comp/Navbar'

import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from '@comp/Breadcrumps'
import { settings } from './state/settings'
import { ReactNode, useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import Loader from '@comp/Loader'
import { setWindowTheme } from './lib/utils'

const SettingsProvider = (props: { children: ReactNode }) => {
  const snap = useSnapshot(settings.state)

  console.log(snap.ready)

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

    console.log('profile', profile)
    setWindowTheme(profile.appearance.theme)
  }, [settings.state.data.profile])

  if (!snap.ready) {
    return null
    // return <Loader />
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
