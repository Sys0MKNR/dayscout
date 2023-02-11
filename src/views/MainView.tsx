import "./main.css";

import "react-toastify/dist/ReactToastify.css";

import { useSnapshot } from "valtio";
import { Positions, state } from "../hooks/useSettings";
import StatusContainer from "@comp/StatusContainer";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  appWindow,
  LogicalPosition,
  LogicalSize,
} from "@tauri-apps/api/window";

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
    await appWindow.setIgnoreCursorEvents(
      snap.settings.appearance.nonInteractive
    );

    await appWindow.setSize(
      new LogicalSize(
        snap.settings.appearance.width,
        snap.settings.appearance.height
      )
    );

    const pos = snap.settings.appearance.position;

    if (pos >= 0) {
      await moveWindow(pos);
    } else if (pos === -1) {
      appWindow.setPosition(
        new LogicalPosition(
          snap.settings.appearance.x,
          snap.settings.appearance.y
        )
      );
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["status", "settings"],
    });
    updateWindow();
  }, [snap.settings]);

  return <StatusContainer {...snap.settings} />;
}

export default MainView;
