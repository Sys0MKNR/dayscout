import './main.css'

import 'react-toastify/dist/ReactToastify.css'

import { useSnapshot } from 'valtio'
import StatusContainer from '@comp/StatusContainer'
import { useEffect } from 'react'
import { appWindow, LogicalPosition, LogicalSize } from '@tauri-apps/api/window'

import { moveWindow } from 'tauri-plugin-positioner-api'
import { settings } from '@/state/settings'
import { useSearchParams } from 'react-router-dom'

function MainView() {
  return (
    <div data-tauri-drag-region className="h-screen" id="drag-root">
      <Wrapper />
    </div>
  )
}

function Wrapper() {
  let [searchParams, setSearchParams] = useSearchParams()

  const profileId = searchParams.get('profile')

  if (!profileId) {
    return 'No theme selected'
  }

  const profile = settings.get('profile', profileId)

  const updateWindow = async () => {
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
  }, [profile])

  return <StatusContainer {...profile} />
}

export default MainView
