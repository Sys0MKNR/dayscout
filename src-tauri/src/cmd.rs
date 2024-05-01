use crate::{
    update_windows,
    utils::Error,
    window::{show_or_create_window, toggle_window},
};

#[tauri::command]
pub async fn show_or_create_window_cmd(
    handle: tauri::AppHandle,
    label: String,
) -> Result<(), Error> {
    show_or_create_window(label.as_str(), &handle)?;
    Ok(())
}

#[tauri::command]
pub async fn toggle_window_cmd(handle: tauri::AppHandle, label: String) -> Result<(), Error> {
    toggle_window(label.as_str(), &handle)?;
    Ok(())
}

#[tauri::command]
pub async fn update_windows_cmd(handle: tauri::AppHandle) {
    update_windows(handle);
}
