import { invoke } from "@tauri-apps/api";

export function toggleWindow(label: string) {
  return invoke("toggle_window_cmd", { label });
}

export function showOrCreateWindow(label: string) {
  return invoke("show_or_create_window_cmd", { label });
}
