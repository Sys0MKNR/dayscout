import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { theme } from './theme/theme'

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications containerWidth={200} position="bottom-left" limit={3} autoClose={2000} />
      {/* <Suspense fallback={<Loader />}> */}
      <ModalsProvider>
        <RouterProvider router={router} />
      </ModalsProvider>
      {/* </Suspense> */}
    </MantineProvider>
  )
}

export default App
