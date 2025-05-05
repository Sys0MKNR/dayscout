import { Suspense } from 'react'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { router } from './router'
import Splaschscreen from '@/components_old/Splaschscreen'
import Loader from '@/components_old/Loader'

import { MantineProvider, createTheme } from '@mantine/core'

import '@mantine/core/styles.css'
import 'mantine-react-table/styles.css'
import { ModalsProvider } from '@mantine/modals'

const theme = createTheme({
  primaryColor: 'purple',
  colors: {
    purple: [
      '#f3edff',
      '#e0d7fa',
      '#beabf0',
      '#9a7ce6',
      '#7c56de',
      '#683dd9',
      '#5f2fd8',
      '#4f23c0',
      '#451eac',
      '#3a1899',
    ],
  },
})
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => console.error(error.message),
  }),
})

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Suspense fallback={<Loader />}>
        <ModalsProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider
              router={router}
              fallbackElement={<Splaschscreen />}
            />
          </QueryClientProvider>
        </ModalsProvider>
      </Suspense>
    </MantineProvider>
  )
}

export default App
