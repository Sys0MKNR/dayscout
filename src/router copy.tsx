import { createBrowserRouter, Link } from 'react-router-dom'
import MainView from './views/Main'
import { ProfilesView } from '@/views/Settings/Profile/Profiles'
import { WindowsView } from '@/views/Settings/Window/Windows'
import { SettingsIndexView } from '@/views/Settings/Index'
import { ProfileView } from './views/Settings/Profile/Profile'
import { WindowView } from './views/Settings/Window/Window'
import { settings } from './state/settings'
import { SettingsView } from './views/Settings/Settings'
import { GeneralSettingsView } from './views/Settings/General'

export const router = createBrowserRouter([
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
        path: 'general',
        handle: {
          crumb: () => <Link to="/settings/general">General</Link>,
        },
        element: <GeneralSettingsView />,
      },
      {
        path: 'window',
        handle: {
          crumb: () => <Link to="/settings/window">Windows</Link>,
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
          crumb: () => <Link to="/settings/profile">Profile</Link>,
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
              crumb: (_data: any, params: any) => {
                return <span>{settings.get('profile', params.id).name}</span>
              },
            },
          },
        ],
      },
    ],
  },
])
