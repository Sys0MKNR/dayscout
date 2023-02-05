import { lazy, Suspense, useEffect, useLayoutEffect, useMemo } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";

import "react-toastify/dist/ReactToastify.css";
import { useSnapshot } from "valtio";
import { state } from "./hooks/useSettings";
import Splaschscreen from "@comp/Splaschscreen";

const SettingsView = lazy(() => import("./views/SettingsView"));
const MainView = lazy(() => import("./views/MainView"));

const queryClient = new QueryClient();

const Wrapper = () => {
  const snap = useSnapshot(state);

  const clientQuery = useQueryClient();

  useLayoutEffect(() => {
    const html = document.querySelector("html");
    html?.setAttribute("data-theme", snap.settings.appearance.theme);
  }, [snap.settings.appearance.theme]);

  useEffect(() => {
    clientQuery.invalidateQueries();
  }, [snap.settings]);

  const view = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get("v");
  }, []);

  if (view === "main") {
    return <MainView />;
  } else if (view === "settings") {
    return <SettingsView />;
  }

  return <h1>404</h1>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Splaschscreen />}>
        <Wrapper></Wrapper>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
