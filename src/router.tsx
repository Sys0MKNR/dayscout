import { createBrowserRouter, Link } from 'react-router-dom'
import MainView from './views/Main'
import { ProfilesView } from '@/views/Settings/Profiles'
import { WindowsView } from '@/views/Settings/Windows'
import { SettingsIndexView } from '@/views/Settings/Index'
import SettingsView from './SettingsView'
import { ProfileView } from './views/Settings/Profile'
import { WindowView } from './views/Settings/Window'
import { availableMonitors } from '@tauri-apps/api/window'
import { settings } from './state/settings'
import { ThemeProvider } from '@comp/ThemeProvider'

export const router = createBrowserRouter([
  {
    element: <ThemeProvider />,
    children: [
      {
        path: '/main',
        element: <MainView />,
      },
      {
        id: 'settings',
        path: '/settings',
        element: <SettingsView />,
        handle: {
          crumb: () => <Link to="/settings">Home</Link>,
        },
        children: [
          {
            index: true,
            element: <SettingsIndexView />,
          },
          {
            path: 'window',
            handle: {
              crumb: (data: any) => <Link to="/settings/window">Windows</Link>,
            },
            children: [
              {
                element: <WindowsView />,
                index: true,
              },
              {
                path: ':id',
                element: <WindowView />,

                handle: {
                  crumb: (data: any, params: any) => {
                    return <span>{settings.get('window', params.id).name}</span>
                  },
                },
              },
            ],
          },

          {
            path: 'profile',
            handle: {
              crumb: (data: any) => <Link to="/settings/profile">Profile</Link>,
            },
            children: [
              {
                element: <ProfilesView />,
                index: true,
              },
              {
                path: ':id',
                element: <ProfileView />,
                handle: {
                  crumb: (data: any, params: any) => {
                    return (
                      <span>{settings.get('profile', params.id).name}</span>
                    )
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
])
