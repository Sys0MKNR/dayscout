import Navbar from "@comp/Navbar";
import { useState } from "react";
import Settings from "@comp/Settings/Settings";

import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

function SettingsView() {
  return (
    <>
      <div className="h-screen transition-all">
        <Navbar></Navbar>

        <main className="flex-1 overflow-y-auto p-5 h-[calc(100vh-64px)]">
          <Settings />
          {/* {settingsActive ? <Settings /> : <MainView />} */}
        </main>
      </div>
      <ToastContainer />
    </>
  );
}

export default SettingsView;
