use tauri::{AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

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

pub fn handle_tray(app: &AppHandle, event: SystemTrayEvent) {
    tauri_plugin_positioner::on_tray_event(app, &event);

    match event {
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            // show_or_create_window("main", app).expect("main window can't be created");
        }

        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            // "settings" => {
            //     show_or_create_window("settings", app, None)
            //         .expect("settings window can't be created");
            // }
            // // "refresh" => {
            // //     app.emit_all("settings-updated", ()).unwrap();
            // // }

            // // "show" => {
            // //     show_or_create_window("main", app).unwrap();
            // // }
            // "hide" => {
            //     let w = app.get_window("main");

            //     if let Some(w) = w {
            //         w.hide().unwrap();
            //     }
            // }
            "exit" => {
                std::process::exit(0);
            }
            _ => {}
        },
        _ => {}
    }
}
