import { range } from "@/lib/utils";
import Status, { StatusProps } from "@comp/Status";
import { appWindow } from "@tauri-apps/api/window";
import { useMemo } from "react";
import { Refresh, Settings, X } from "tabler-icons-react";

import { useQueryClient } from "@tanstack/react-query";

import { invoke } from "@tauri-apps/api";

export interface StatusContainerProps extends StatusProps {
  toolbar?: boolean;
  closeBtn?: boolean;
  quitOnClose?: boolean;
}

function StatusContainer(props: StatusContainerProps) {
  const { toolbar = true, closeBtn = true } = props;

  const queryClient = useQueryClient();

  const { background, backgroundTransparency, themeBackground } =
    props.appearance;

  const bg = useMemo(() => {
    console.log(props.appearance);

    if (themeBackground) {
      let color = "transparent";

      if (backgroundTransparency > 0) {
        color = `hsl(var(--b1) / ${backgroundTransparency / 100})`;
      }

      return color;
    }

    const transparency = Math.round(
      range(0, 100, 0, 255, backgroundTransparency)
    )
      .toString(16)
      .padStart(2, "0");

    return background + transparency;
  }, [props.appearance]);

  const toggleSettigns = async () => {
    await invoke("toggle_window_cmd", { label: "settings" });
  };

  return (
    <div
      style={{
        backgroundColor: bg,
      }}
      className="card h-full card-compact bg-base-100 group px-2"
    >
      {toolbar && (
        <div
          id="main-toolbar"
          className="h-8 pr-1 card-actions justify-end opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <button
            className="btn btn-ghost btn-sm"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["status", "settings"],
              })
            }
          >
            <Refresh></Refresh>
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={async () => {
              toggleSettigns();
            }}
          >
            <Settings></Settings>
          </button>
          {closeBtn && (
            <button
              className="btn btn-ghost btn-sm item text-right"
              onClick={() => {
                if (props.quitOnClose) {
                  appWindow.close();
                } else {
                  appWindow.hide();
                }
              }}
            >
              <X></X>
            </button>
          )}
        </div>
      )}

      <Status {...props}></Status>
    </div>
  );
}

export default StatusContainer;
