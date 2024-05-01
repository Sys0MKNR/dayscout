import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'

import { router } from './router'
import Splaschscreen from '@comp/Splaschscreen'
import Loader from '@comp/Loader'

const queryClient = new QueryClient()

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={<Splaschscreen />} />
      </QueryClientProvider>
    </Suspense>
  )
}

export default App
