import { useQueryClient } from "@tanstack/react-query";
import { appWindow } from "@tauri-apps/api/window";
import { Refresh, X } from "tabler-icons-react";

export interface NavbarProps {
  fullscreen?: boolean;
}

function Navbar(props: NavbarProps) {
  const queryClient = useQueryClient();

  return (
    <header
      data-tauri-drag-region
      className="navbar bg-primary flex justify-between sticky top-0 z-10 text-base-100 "
    >
      <div className="">
        <a className="btn btn-ghost normal-case text-xl">Dayscout</a>
      </div>
      <div className="flex">
        {/* <button
          className="btn btn-square btn-ghost"
          onClick={() => queryClient.invalidateQueries()}
        >
          <Refresh />
        </button> */}
        <button
          className="btn btn-square btn-ghost"
          onClick={() => appWindow.hide()}
        >
          <X />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
