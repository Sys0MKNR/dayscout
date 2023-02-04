import "./main.css";

import "react-toastify/dist/ReactToastify.css";

import { useSnapshot } from "valtio";
import { state } from "../hooks/useSettings";
import StatusContainer from "@comp/StatusContainer";

function MainView() {
  return (
    <div data-tauri-drag-region className="h-screen" id="drag-root">
      <Wrapper />
    </div>
  );
}

function Wrapper() {
  const snap = useSnapshot(state);

  return <StatusContainer fullScreen={true} {...snap.settings} />;
}

export default MainView;
