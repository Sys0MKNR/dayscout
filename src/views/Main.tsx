import './main.css'

import 'react-toastify/dist/ReactToastify.css'

import { useSnapshot } from 'valtio'
import StatusContainer from '@comp/StatusContainer'
import { useEffect } from 'react'
import { appWindow, LogicalPosition, LogicalSize } from '@tauri-apps/api/window'

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
  const snap = useSnapshot(status.state)
  let [searchParams, setSearchParams] = useSearchParams()

  const profileId = searchParams.get('profile')

  if (!profileId) {
    return 'No profile found'
  }

  const updateWindow = async () => {
    const profile = status.state.profile

    if (!profile) {
      return
    }

    setWindowTheme(profile.appearance.theme)

    await appWindow.setIgnoreCursorEvents(profile.appearance.nonInteractive)

    await appWindow.setSize(
      new LogicalSize(profile.appearance.width, profile.appearance.height)
    )

    const pos = profile.appearance.position

    if (pos >= 0) {
      await moveWindow(pos)
    } else if (pos === -1) {
      appWindow.setPosition(
        new LogicalPosition(profile.appearance.x, profile.appearance.y)
      )
    }
  }

  useEffect(() => {
    updateWindow()
  }, [status.state.profile])

  useEffect(() => {
    status.init(profileId)
  }, [profileId])

  if (!snap.profile) {
    return null
  }

  return <StatusContainer {...snap.profile} />
}

export default MainView
