use crate::utils::Error;
// use crate::window::{show_or_create_window, toggle_window};

#[tauri::command]
pub async fn show_or_create_window_cmd(
    handle: tauri::AppHandle,
    label: String,
) -> Result<(), Error> {
    // show_or_create_window(label.as_str(), &handle, None)?;
    Ok(())
}

#[tauri::command]
pub async fn toggle_window_cmd(handle: tauri::AppHandle, label: String) -> Result<(), Error> {
    // toggle_window(label.as_str(), &handle)?;
    Ok(())
}

#[tauri::command]
pub async fn update_settings_cmd(handle: tauri::AppHandle) -> Result<(), Error> {
    Ok(())
}
