use tauri::{window, AppHandle, Manager};

use crate::utils::Error;

pub fn create_main_window(app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window =
        tauri::WindowBuilder::new(app_handle, "settings", tauri::WindowUrl::App("/".into()))
            .fullscreen(false)
            .inner_size(800.0, 600.0)
            .transparent(false)
            .visible(false)
            .resizable(true)
            .decorations(true)
            .title("dayscout settings")
            .build()?;

    Ok(window)
}

pub fn create_status_window(label: &str, app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window =
        tauri::WindowBuilder::new(app_handle, label, tauri::WindowUrl::App("/status".into()))
            .fullscreen(false)
            .inner_size(200.0, 200.0)
            .resizable(false)
            .skip_taskbar(true)
            .title("dayscout")
            .transparent(true)
            .visible(false)
            .decorations(false)
            .always_on_top(true)
            .build()?;

    Ok(window)
}

pub fn show_or_create_window(label: &str, app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window: tauri::Window = get_or_create_window(label, app_handle)?;
    window.show()?;
    Ok(window)
}

pub fn get_or_create_window(label: &str, app_handle: &AppHandle) -> Result<window::Window, Error> {
    match app_handle.get_window(label) {
        Some(w) => Ok(w),
        None => match label {
            "settings" => create_main_window(app_handle),
            l => create_status_window(l, app_handle),
        },
    }
}

pub fn toggle_window(label: &str, app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window = match app_handle.get_window(label) {
        Some(w) => {
            if w.is_visible()? {
                w.hide()?;
            } else {
                w.show()?;
            }
            w
        }
        None => show_or_create_window(label, app_handle)?,
    };

    Ok(window)
}
