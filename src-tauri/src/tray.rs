use std::sync::Arc;

use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIcon, TrayIconBuilder},
    AppHandle, Manager,
};

use crate::{
    load_overlays_async, task::TaskManager, utils::Error, windows::show_or_create_window,
};

pub fn create_tray(app: &AppHandle) -> Result<TrayIcon, Error> {
    let settings_item = MenuItem::with_id(app, "main", "Main Window", true, None::<&str>)?;
    let reload = MenuItem::with_id(app, "reload", "Reload Overlays", true, None::<&str>)?;
    let show = MenuItem::with_id(app, "show", "Show Overlays", true, None::<&str>)?;
    let hide = MenuItem::with_id(app, "hide", "Hide Overlays", true, None::<&str>)?;
    let exit_item = MenuItem::with_id(app, "exit", "Exit", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&settings_item, &reload, &show, &hide, &exit_item])?;

    let tray = TrayIconBuilder::new()
        .menu(&menu)
        .icon(app.default_window_icon().unwrap().clone())
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "main" => {
                show_or_create_window("main", app).expect("main window can't be created");
            }
            "reload" => load_overlays_async(app.app_handle().clone()),
            "show" => load_overlays_async(app.app_handle().clone()),
            "hide" => {
                app.webview_windows().iter().for_each(|w| {
                    if w.0 == "main" {
                        return;
                    }
                    w.1.hide().unwrap();
                });

                tauri::async_runtime::block_on(async move {
                    let task_manager = app.try_state::<Arc<TaskManager>>().unwrap();
                    task_manager.stop_all().await;
                })
            }
            "exit" => {
                std::process::exit(0);
            }
            _ => {}
        })
        .build(app)?;

    return Ok(tray);
}
