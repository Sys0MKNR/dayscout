use std::collections::HashMap;

use tauri::{window, AppHandle, Manager};

use crate::utils::Error;

pub fn create_settings_window(app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window = tauri::WindowBuilder::new(
        app_handle,
        "settings",
        tauri::WindowUrl::App("/settings".into()),
    )
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

// pub fn create_main_window(label: &str, app_handle: &AppHandle) -> Result<window::Window, Error> {
//     let window =
//         tauri::WindowBuilder::new(app_handle, label, tauri::WindowUrl::App("/main".into()))
//             .fullscreen(false)
//             .inner_size(200.0, 200.0)
//             .resizable(false)
//             .skip_taskbar(true)
//             .title("dayscout")
//             .transparent(true)
//             .visible(false)
//             .decorations(false)
//             .always_on_top(true)
//             .build()?;

//     Ok(window)
// }

pub fn create_main_window(
    label: &str,
    profile: &str,
    app_handle: &AppHandle,
) -> Result<window::Window, Error> {
    let window = tauri::WindowBuilder::new(
        app_handle,
        label,
        tauri::WindowUrl::App(format!("/main?profile={}", profile).into()),
    )
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

// pub fn show_or_create_window(
//     label: &str,
//     app_handle: &AppHandle,
//     params: Option<HashMap<String, &str>>,
// ) -> Result<window::Window, Error> {
//     let window: tauri::Window = get_or_create_window(label, app_handle, params)?;
//     window.show()?;
//     Ok(window)
// }

// pub fn get_or_create_window(
//     label: &str,
//     app_handle: &AppHandle,
//     params: Option<HashMap<String, &str>>,
// ) -> Result<window::Window, Error> {
//     match app_handle.get_window(label) {
//         Some(w) => Ok(w),
//         None => match label {
//             "settings" => create_settings_window(app_handle),
//             l => {
//                 let p = match params {
//                     Some(p) => p.get("profile").unwrap_or(&""),
//                     None => "",
//                 };

//                 create_main_window(l, p, app_handle)
//             }
//         },
//     }
// }

// pub fn toggle_window(label: &str, app_handle: &AppHandle) -> Result<window::Window, Error> {
//     let window = match app_handle.get_window(label) {
//         Some(w) => {
//             if w.is_visible()? {
//                 w.hide()?;
//             } else {
//                 w.show()?;
//             }
//             w
//         }
//         None => show_or_create_window(label, app_handle, None)?,
//     };

//     Ok(window)
// }
