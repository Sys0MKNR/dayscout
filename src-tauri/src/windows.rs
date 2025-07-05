use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

use crate::utils::Error;

pub fn create_main_window(app_handle: &AppHandle) -> Result<WebviewWindow, Error> {
    let window = WebviewWindowBuilder::new(app_handle, "main", WebviewUrl::App("/".into()))
        .fullscreen(false)
        .inner_size(800.0, 600.0)
        .transparent(false)
        .visible(false)
        .resizable(true)
        .decorations(true)
        .title("dayscout")
        .build()?;

    Ok(window)
}

pub fn create_status_window(label: &str, app_handle: &AppHandle) -> Result<WebviewWindow, Error> {
    let window =
        WebviewWindowBuilder::new(app_handle, label, WebviewUrl::App("/status.html".into()))
            .fullscreen(false)
            .inner_size(200.0, 200.0)
            .resizable(false)
            .skip_taskbar(true)
            .title("dayscout status")
            .transparent(true)
            .visible(false)
            .decorations(false)
            .shadow(false)
            .always_on_top(true)
            .build()?;

    Ok(window)
}

pub fn show_or_create_window(label: &str, app_handle: &AppHandle) -> Result<WebviewWindow, Error> {
    let window = get_or_create_window(label, app_handle)?;
    window.show()?;
    Ok(window)
}

pub fn get_or_create_window(label: &str, app_handle: &AppHandle) -> Result<WebviewWindow, Error> {
    match app_handle.get_webview_window(label) {
        Some(w) => Ok(w),
        None => match label {
            "main" => create_main_window(app_handle),
            l => create_status_window(l, app_handle),
        },
    }
}

pub fn toggle_window(label: &str, app_handle: &AppHandle) -> Result<WebviewWindow, Error> {
    let window = match app_handle.get_webview_window(label) {
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
