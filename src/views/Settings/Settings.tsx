import Navbar from '@comp/Navbar'
import { Outlet } from 'react-router-dom'

import { Breadcrumbs } from '@comp/Breadcrumps'

export function SettingsView() {
  return (
    <div className="h-screen transition-all">
      <Navbar></Navbar>
      <Breadcrumbs />

      <main className="flex-1 overflow-y-auto p-5 h-[calc(100vh-120px)]">
        <Outlet />
      </main>
    </div>
  )
}
