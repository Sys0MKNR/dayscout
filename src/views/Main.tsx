import './main.css'

import { useSnapshot } from 'valtio'
import StatusContainer from '@/components_old/StatusContainer'
import { useEffect, useState } from 'react'
import {
  appWindow,
  LogicalPosition,
  LogicalSize,
  primaryMonitor,
  availableMonitors,
  Monitor,
} from '@tauri-apps/api/window'

import { moveWindow } from 'tauri-plugin-positioner-api'
import { useSearchParams } from 'react-router-dom'
import { status } from '@/state/status'
import { setWindowTheme } from '@/lib/utils'

function MainView() {
  return (
    <div data-tauri-drag-region className="h-screen" id="drag-root">
      <Wrapper />
    </div>
  )
}

function Wrapper() {
  const [loading, setLoading] = useState(true)
  const snap = useSnapshot(status.state)
  const [searchParams, _setSearchParams] = useSearchParams()

  const profileId = searchParams.get('profile')

  const windowId = searchParams.get('window')

  if (!profileId || !windowId) {
    return '404'
  }

  const updateWindow = async () => {
    const profile = status.state.profile
    const window = status.state.window

    if (!profile || !window) {
      return
    }

    setWindowTheme(profile.appearance.theme)

    await appWindow.setIgnoreCursorEvents(profile.appearance.nonInteractive)

    await appWindow.setSize(
      new LogicalSize(profile.appearance.width, profile.appearance.height)
    )

    let monitor: Monitor | undefined | null = null

    if (window.monitor) {
      const monitors = await availableMonitors()

      monitor = monitors.find((mon) => mon.name === window.monitor)
    } else {
      monitor = await primaryMonitor()
    }

    if (monitor) {
      await appWindow.setPosition(monitor.position)
    }

    const pos = profile.appearance.position

    if (pos >= 0) {
      await moveWindow(pos)
    } else if (pos === -1) {
      await appWindow.setPosition(
        new LogicalPosition(profile.appearance.x, profile.appearance.y)
      )
    }
  }

  const load = async () => {
    await status.init(profileId, windowId)
    setLoading(false)
  }

  useEffect(() => {
    updateWindow()
  }, [status.state.profile, searchParams])

  useEffect(() => {
    load()
  }, [profileId, windowId])

  if (!snap.profile) {
    return null
  }

  if (loading) {
    return null
  }

  return <StatusContainer {...snap.profile} />
}

export default MainView
