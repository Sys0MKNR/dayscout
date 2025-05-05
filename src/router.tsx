import { createBrowserRouter } from 'react-router-dom'

import { HomeView } from './views/Home'
import { SettingsIndexView } from './views/Settings/Index'
import { GeneralSettingsView } from './views/Settings/General'
import { WindowsView } from './views/Settings/Window/Windows'

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
        element: '',
      },
      {
        path: 'settings',
        handle: {
          crumb: 'Settings',
        },
        children: [
          {
            index: true,
            element: <SettingsIndexView />,
          },
          {
            path: 'general',
            handle: {
              crumb: 'General',
            },
            element: <GeneralSettingsView />,
          },
          {
            path: 'window',
            handle: {
              crumb: 'Windows',
            },
            children: [
              {
                element: <WindowsView />,
                index: true,
              },
              // {
              //   path: ':id',
              //   element: <WindowView />,

              //   handle: {
              //     crumb: (data: any, params: any) => {
              //       return <span>{settings.get('window', params.id).name}</span>
              //     },
              //   },
              // },
            ],
          },

          // {
          //   path: 'profile',
          //   handle: {
          //     crumb: () => <Link to="/settings/profile">Profile</Link>,
          //   },
          //   children: [
          //     {
          //       element: <ProfilesView />,
          //       index: true,
          //     },
          //     {
          //       path: ':id',
          //       element: <ProfileView />,
          //       handle: {
          //         crumb: (_data: any, params: any) => {
          //           return (
          //             <span>{settings.get('profile', params.id).name}</span>
          //           )
          //         },
          //       },
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
  // {
  //   id: 'settings',
  //   path: '/settings',
  //   element: <SettingsView />,
  //   handle: {
  //     crumb: () => <Link to="/settings">Home</Link>,
  //   },
  //   children: [
  //     {
  //       index: true,
  //       element: <SettingsIndexView />,
  //     },
  //     {
  //       path: 'general',
  //       handle: {
  //         crumb: () => <Link to="/settings/general">General</Link>,
  //       },
  //       element: <GeneralSettingsView />,
  //     },
  //     {
  //       path: 'window',
  //       handle: {
  //         crumb: () => <Link to="/settings/window">Windows</Link>,
  //       },
  //       children: [
  //         {
  //           element: <WindowsView />,
  //           index: true,
  //         },
  //         {
  //           path: ':id',
  //           element: <WindowView />,

  //           handle: {
  //             crumb: (data: any, params: any) => {
  //               return <span>{settings.get('window', params.id).name}</span>
  //             },
  //           },
  //         },
  //       ],
  //     },

  //     {
  //       path: 'profile',
  //       handle: {
  //         crumb: () => <Link to="/settings/profile">Profile</Link>,
  //       },
  //       children: [
  //         {
  //           element: <ProfilesView />,
  //           index: true,
  //         },
  //         {
  //           path: ':id',
  //           element: <ProfileView />,
  //           handle: {
  //             crumb: (_data: any, params: any) => {
  //               return <span>{settings.get('profile', params.id).name}</span>
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
])
