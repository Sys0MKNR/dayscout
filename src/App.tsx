import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { Loader, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, useEffect } from 'react'
import { RouterProvider } from 'react-router'
// import { initSettings } from './lib/settings'
import { router } from './router'
import { theme } from './theme/theme'

const queryClient = new QueryClient()

function App() {
  const init = async () => {
    // await initSettings()
    await queryClient.resetQueries()
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: init is only called once>
  useEffect(() => {
    init()
  }, [])

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications
        containerWidth={200}
        position="bottom-left"
        limit={3}
        autoClose={2000}
      />
      <Suspense fallback={<Loader />}>
        <ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </ModalsProvider>
      </Suspense>
    </MantineProvider>
  )
}

export default App
