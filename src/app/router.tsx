import { createBrowserRouter } from 'react-router'
import { Layout } from './routes/Layout'
import { IndexRoute } from './routes/Index'
import { SettingsRoute } from './routes/Settings'
import { OverlayRoute } from './routes/Overlay/Overlay'
import { OverlayNewRoute } from './routes/Overlay/OverlayNew'
import { OverlayActionRoutes } from './routes/Overlay/OverlayAction'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,

    handle: {
      crumb: 'Home',
    },
    children: [IndexRoute, SettingsRoute, OverlayRoute, OverlayNewRoute, ...OverlayActionRoutes],
  },
])
