#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::vec;

use tauri::{
    window, AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
};

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Tauri(#[from] tauri::Error),
    #[error("unknown window label")]
    InvalidWindowLabel,
}

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
    .decorations(true)
    .title("dayscout settings")
    .build()?;

    Ok(window)
}

fn create_main_window(app_handle: &AppHandle) -> Result<window::Window, Error> {
    let window = tauri::WindowBuilder::new(
        app_handle,
        "main",
        tauri::WindowUrl::App("index.html?v=main".into()),
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

fn show_or_create_window(label: &str, app_handle: &AppHandle) -> Result<(), Error> {
    let window = get_or_create_window(label, app_handle)?;
    window.show()?;
    Ok(())
}

fn get_or_create_window(label: &str, app_handle: &AppHandle) -> Result<window::Window, Error> {
    match app_handle.get_window(label) {
        Some(w) => Ok(w),
        None => match label {
            "settings" => create_settings_window(app_handle),
            "main" => create_main_window(app_handle),
            _ => Err(Error::InvalidWindowLabel),
        },
    }
}

fn toggle_window(label: &str, app_handle: &AppHandle) -> Result<(), Error> {
    let window = app_handle.get_window(label);

    match window {
        Some(w) => {
            let visible = w.is_visible()?;

            if visible {
                w.hide()?;
            } else {
                w.show()?
            }
        }
        None => show_or_create_window(label, app_handle)?,
    };

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
    let settings_item = CustomMenuItem::new("settings".to_string(), "Settings");
    let refresh = CustomMenuItem::new("refresh".to_string(), "Refresh");
    let show = CustomMenuItem::new("show".to_string(), "Show");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let exit_item = CustomMenuItem::new("exit".to_string(), "Exit");

    let tray_menu = SystemTrayMenu::new()
        .add_item(settings_item)
        .add_item(refresh)
        .add_item(show)
        .add_item(hide)
        .add_item(exit_item);

    let windows: Vec<tauri::Window> = vec![];

    let system_tray = SystemTray::new().with_menu(tray_menu);

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        // .plugin(tauri_plugin_window_state::Builder::default().build())
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
                    "refresh" => {
                        app.emit_all("settings-updated", ()).unwrap();
                    }

                    "show" => {
                        show_or_create_window("main", app).unwrap();
                    }

                    "hide" => {
                        let w = app.get_window("main");

                        if let Some(w) = w {
                            w.hide().unwrap();
                        }
                    }

                    "exit" => {
                        std::process::exit(0);
                    }
                    _ => {}
                },
                _ => {}
            }
        })
        .setup(|app| {
            show_or_create_window("main", &(app.app_handle()))
                .expect("main window can't be created");
            // let w = app.get_window("main");
            // if let Some(w) = w {
            //     w.set_resizable(true).unwrap();
            // }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, _event| {});
}
