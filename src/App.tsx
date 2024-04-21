import { ReactNode, Suspense, lazy, useEffect, useMemo, useState } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RouterProvider, useSearchParams } from 'react-router-dom'

import 'react-toastify/dist/ReactToastify.css'
import { useSnapshot } from 'valtio'
// import { listenToSettingsChange, state } from './state/useSettings'
import { router } from './router'
import Splaschscreen from '@comp/Splaschscreen'
import { settings } from './state/settings'
import Loader from '@comp/Loader'

const queryClient = new QueryClient()

//   // useLayoutEffect(() => {
//   //   const html = document.querySelector('html')

//   //   html?.setAttribute('data-theme', snap.settings.appearance.theme)
//   // }, [snap.settings.appearance.theme])

//   useEffect(() => {
//     const unlisten = listenToSettingsChange()
//     return () => {
//       unlisten.then((fn) => fn())
//     }
//   }, [])

const SettingsProvider = (props: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true)

  const load = async () => {
    await settings.init()
    setLoading(false)
  }

  useEffect(() => {
    load()
    return settings.state.unsubscribe
  }, [])

  if (loading) {
    return <Loader />
  }

  return props.children
}

function App() {
  return (
    <Suspense fallback={'loading...'}>
      <SettingsProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} fallbackElement={<Splaschscreen />} />
        </QueryClientProvider>
      </SettingsProvider>
    </Suspense>
  )
}

export default App
