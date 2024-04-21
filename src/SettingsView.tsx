import Navbar from '@comp/Navbar'
import Settings from '@comp/Settings/Settings'

import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from '@comp/Breadcrumps'

function SettingsView() {
  return (
    <>
      <div className="h-screen transition-all">
        <Navbar></Navbar>

        <Breadcrumbs />

        <main className="flex-1 p-5 h-[calc(100vh-120px)]">
          <Outlet></Outlet>
        </main>
      </div>
      <ToastContainer />
    </>
  )
}

export default SettingsView
