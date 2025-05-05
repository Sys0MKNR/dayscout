import { showOrCreateWindow } from '@/lib/internalApi'
import { emit } from '@tauri-apps/api/event'

import { IconChevronUpRight, IconRefresh } from '@tabler/icons-react'
export interface NavbarProps {
  fullscreen?: boolean
}

function Navbar() {
  return (
    <header
      data-tauri-drag-region
      className="navbar bg-primary flex justify-between sticky top-0 z-10 text-base-100 "
    >
      <div className="">
        <a className="btn btn-ghost normal-case text-xl">Dayscout</a>
      </div>

      <div className="flex">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => showOrCreateWindow('main')}
        >
          <IconChevronUpRight />
        </button>
        <button
          className="btn btn-square btn-ghost"
          onClick={() => emit('status:forceRefresh')}
        >
          <IconRefresh />
        </button>
      </div>
    </header>
  )
}

export default Navbar
