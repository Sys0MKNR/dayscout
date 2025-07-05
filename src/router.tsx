import { createBrowserRouter } from 'react-router'
import { HomeView } from './views/Home'
import { OverlayView } from './views/Overlay/Overlay'
import { OverlayNewView } from './views/Overlay/OverlayNew'
import { OverlaysView } from './views/Overlay/Overlays'
import { SettingsView } from './views/Settings/Settings'

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
      },
      {
        path: 'overlay/new',
        handle: {
          crumb: 'New Overlay',
        },
        element: <OverlayNewView />,
      },

      {
        path: 'overlay/:id',
        handle: {
          crumb: 'Overlay',
        },
        element: <OverlayView />,
      },
    ],
  },
])
