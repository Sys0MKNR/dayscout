#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use std::error::Error;

use tauri::{
    window, AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
};
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Tauri(#[from] tauri::Error),
    #[error("unknown window label")]
    InvalidWindowLabel,
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

fn create_settings_window(app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window = tauri::WindowBuilder::new(
        app_handle,
        "settings",
        tauri::WindowUrl::App("index.html?v=settings".into()),
    )
    .fullscreen(false)
    .inner_size(800.0, 600.0)
    .transparent(false)
    .visible(false)
    .resizable(true)
    .decorations(false)
    .title("dayscout settings")
    .build()?;

    Ok(window)
}

fn create_main_window(app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window = tauri::WindowBuilder::new(
        app_handle,
        "main",
        tauri::WindowUrl::App("index.html?a=main".into()),
    )
    .fullscreen(false)
    .inner_size(200.0, 200.0)
    .resizable(false)
    .skip_taskbar(true)
    .title("dayscout")
    .transparent(true)
    .visible(false)
    .decorations(false)
    .build()?;

    Ok(window)
}

fn show_or_create_window(label: &str, app_handle: &AppHandle) -> Result<(), Error> {
    let window = get_or_create_window(label, app_handle)?;
    window.show()?;
    Ok(())
}

fn get_or_create_window(label: &str, app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window = match app_handle.get_window(label) {
        Some(w) => Ok(w),
        None => {
            let window = match label {
                "settings" => create_settings_window(app_handle),
                "main" => create_main_window(app_handle),
                _ => Err(Error::InvalidWindowLabel),
            };

            window
        }
    };

    window
}

fn toggle_window(label: &str, app_handle: &AppHandle) -> Result<(), Error> {
    let window = get_or_create_window(label, app_handle)?;

    let visible = window.is_visible()?;

    if visible {
        window.hide()?;
    } else {
        window.show()?;
    }

    Ok(())
}

#[tauri::command]
async fn show_or_create_window_cmd(handle: tauri::AppHandle, label: String) -> Result<(), Error> {
    show_or_create_window(label.as_str(), &handle)?;
    Ok(())
}

#[tauri::command]
async fn toggle_window_cmd(handle: tauri::AppHandle, label: String) -> Result<(), Error> {
    toggle_window(label.as_str(), &handle)?;
    Ok(())
}

fn main() {
    let exit_item = CustomMenuItem::new("exit".to_string(), "Exit");
    let settings_item = CustomMenuItem::new("settings".to_string(), "Settings");

    let tray_menu = SystemTrayMenu::new()
        .add_item(settings_item)
        .add_item(exit_item);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_positioner::init())
        .invoke_handler(tauri::generate_handler![
            show_or_create_window_cmd,
            toggle_window_cmd
        ])
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| {
            tauri_plugin_positioner::on_tray_event(app, &event);

            match event {
                SystemTrayEvent::LeftClick {
                    position: _,
                    size: _,
                    ..
                } => {
                    show_or_create_window("main", app).expect("main window can't be created");
                }
                SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                    "settings" => {
                        show_or_create_window("settings", app)
                            .expect("settings window can't be created");
                    }
                    "exit" => {
                        app.save_window_state(StateFlags::all()).unwrap();
                        std::process::exit(0);
                    }
                    _ => {}
                },
                _ => {}
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, _event| {});
}
