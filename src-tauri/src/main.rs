#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{
    window, AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
};
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

fn create_settings_window(app_handle: &AppHandle) -> window::Window {
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
    .build()
    .unwrap();

    window
}

fn create_main_window(app_handle: &AppHandle) -> window::Window {
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
    .build()
    .unwrap();

    window
}

fn show_or_create_window(label: &str, app_handle: &AppHandle) {
    let window = get_or_create_window(label, app_handle);
    window.show().unwrap();
}

fn get_or_create_window(label: &str, app_handle: &AppHandle) -> window::Window {
    let window = match app_handle.get_window(label) {
        Some(w) => w,
        None => {
            let window = match label {
                "settings" => create_settings_window(app_handle),
                "main" => create_main_window(app_handle),
                _ => panic!("unknown window"),
            };

            window
        }
    };

    window
}

fn toggle_window(label: &str, app_handle: &AppHandle) {
    let window = get_or_create_window(label, app_handle);

    let visible = match window.is_visible() {
        Ok(v) => v,
        Err(e) => panic!("error while getting window visibility: {}", e),
    };

    if visible {
        window.hide().unwrap();
    } else {
        window.show().unwrap();
    }
}

#[tauri::command]
async fn show_or_create_window_cmd(handle: tauri::AppHandle, label: String) {
    show_or_create_window(label.as_str(), &handle);
}

#[tauri::command]
async fn toggle_window_cmd(handle: tauri::AppHandle, label: String) {
    toggle_window(label.as_str(), &handle);
}

fn main() {
    let exit_item = CustomMenuItem::new("exit".to_string(), "Exit");
    let settings_item = CustomMenuItem::new("settings".to_string(), "Settings");

    let tray_menu = SystemTrayMenu::new()
        .add_item(exit_item)
        .add_item(settings_item);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            show_or_create_window_cmd,
            toggle_window_cmd
        ])
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                show_or_create_window("main", app);
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "settings" => {
                    show_or_create_window("settings", app);
                }
                "exit" => {
                    app.save_window_state(StateFlags::all()).unwrap();
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, _event| {});
}
