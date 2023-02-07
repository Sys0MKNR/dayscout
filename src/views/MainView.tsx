import "./main.css";

import "react-toastify/dist/ReactToastify.css";

import { useSnapshot } from "valtio";
import { Positions, state } from "../hooks/useSettings";
import StatusContainer from "@comp/StatusContainer";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { appWindow, LogicalSize, PhysicalSize } from "@tauri-apps/api/window";

import { moveWindow } from "tauri-plugin-positioner-api";

function MainView() {
  return (
    <div data-tauri-drag-region className="h-screen" id="drag-root">
      <Wrapper />
    </div>
  );
}

function Wrapper() {
  const snap = useSnapshot(state);

  const queryClient = useQueryClient();

  const updateWindow = async () => {
    await appWindow.setIgnoreCursorEvents(snap.settings.appearance.displayOnly);

    await moveWindow(snap.settings.appearance.position);

    await appWindow.setSize(
      new LogicalSize(
        snap.settings.appearance.width,
        snap.settings.appearance.height
      )
    );
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["status", "settings"],
    });
    updateWindow();
  }, [snap.settings]);

  // useEffect(() => {

  // }, [snap.settings.url, snap.settings.token]);

  return <StatusContainer fullScreen={true} {...snap.settings} />;
}

export default MainView;
