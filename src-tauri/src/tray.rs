use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

use crate::{update_windows, window::show_or_create_window};

// use crate::window::show_or_create_window;

pub fn create_tray() -> SystemTray {
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

    SystemTray::new().with_menu(tray_menu)
}

pub fn handle_tray(handle: &AppHandle, event: SystemTrayEvent) {
    tauri_plugin_positioner::on_tray_event(handle, &event);

    match event {
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => update_windows(handle.clone()),
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "settings" => {
                show_or_create_window("settings", handle, None)
                    .expect("settings window can't be created");
            }
            "refresh" => update_windows(handle.clone()),
            "show" => update_windows(handle.clone()),
            "hide" => {
                handle.windows().iter().for_each(|w| {
                    if w.0 == "main" {
                        return;
                    }
                    w.1.hide().unwrap();
                });
            }
            "exit" => {
                std::process::exit(0);
            }
            _ => {}
        },
        _ => {}
    }
}
