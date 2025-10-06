import { availableMonitors } from '@tauri-apps/api/window'
import { createBrowserRouter } from 'react-router'
import { getFonts, getOverlay, getSettings } from './lib/api'
import { HomeView } from './views/Home'
import { OverlayView } from './views/Overlay/Overlay'
import { OverlayNewView } from './views/Overlay/OverlayNew'
import { OverlaysView } from './views/Overlay/Overlays'
import { SettingsView } from './views/Settings/Settings'

async function loadAdditionalFormData() {
  const monitors = (await availableMonitors())
    .map((m) => m.name)
    .filter((m) => m)

  const fonts = await getFonts()
  return {
    monitors,
    fonts,
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeView />,

    handle: {
      crumb: 'Home',
    },
    children: [
      {
        index: true,
        element: <OverlaysView />,
        id: 'overlays',
        handle: {
          crumb: 'Overlays',
        },
      },
      {
        path: 'settings',
        handle: {
          crumb: 'Settings',
        },
        element: <SettingsView />,
        loader: async () => {
          console.log('Loading settings data')
          return {
            settings: await getSettings(),
          }
        },
      },
      {
        path: 'overlay/new',
        handle: {
          crumb: 'New Overlay',
        },
        element: <OverlayNewView />,
        loader: loadAdditionalFormData,
      },
      {
        path: 'overlay/:id',
        handle: {
          crumb: 'Overlay',
        },
        element: <OverlayView />,
        loader: async ({ params }) => {
          if (!params.id) {
            throw new Error('Overlay ID is required')
          }

          const overlay = await getOverlay(params.id)

          const additionalData = await loadAdditionalFormData()

          return {
            overlay,
            ...additionalData,
          }
        },
      },
    ],
  },
])
