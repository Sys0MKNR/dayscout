use std::{collections::HashMap, sync::Arc};

use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};
use config::Config;
use tauri::{
    AppHandle, Emitter, Manager, PhysicalPosition, PhysicalSize, WebviewWindow, WindowEvent,
};
use tauri_plugin_positioner::WindowExt;

use tray::create_tray;
use utils::Error;
use windows::show_or_create_window;

use crate::windows::get_or_create_window;

mod api;
mod cmd;
mod config;
mod overlay;
mod task;
mod tray;
mod utils;
mod windows;

async fn load_overlays(app_handle: &AppHandle) -> Result<(), Error> {
    let config = app_handle.state::<Config>();
    let config = config.data.lock().await;

    let mut windows: HashMap<String, WebviewWindow> = app_handle.webview_windows();
    windows.remove("main");

    let task_manager = app_handle.state::<task::TaskManager>();

    task_manager.stop_all().await;

    let mut new_windows: Vec<String> = vec![];

    for o in &config.overlays {
        if !o.enabled {
            continue;
        }

        let available_monitors = app_handle.available_monitors()?;
        let default_monitor_name = "".to_string();
        let monitors = match o.all_monitors {
            true => available_monitors,
            false => available_monitors
                .into_iter()
                .filter(|monitor| {
                    o.monitors
                        .contains(monitor.name().unwrap_or(&default_monitor_name))
                })
                .collect(),
        };

        if monitors.is_empty() {
            log::debug!("No monitors found for overlay: {}", o.id);
            continue;
        }

        for monitor in monitors {
            let monitor_name = match monitor.name() {
                Some(name) => name,
                None => {
                    log::debug!("Monitor was removed. Skipping overlay creation for it.");
                    continue;
                }
            };

            let label = format!("{}_{}", o.id, URL_SAFE_NO_PAD.encode(monitor_name));
            let w = get_or_create_window(label.as_str(), app_handle)?;

            w.hide()?;

            new_windows.push(label.clone());

            w.set_size(PhysicalSize::new(o.width, o.height))?;
            w.set_position(monitor.position().clone())?;
            w.set_ignore_cursor_events(!o.interactive)?;

            match o.position {
                overlay::PositionType::Preset => {
                    w.move_window(o.get_preset_position()?)?;
                }
                overlay::PositionType::Custom => {
                    let window_pos = w.inner_position()?;
                    let new_pos = PhysicalPosition {
                        x: window_pos.x + o.custom_position.x,
                        y: window_pos.y + o.custom_position.y,
                    };

                    w.set_position(new_pos)?;
                }
                _ => {}
            }

            w.show()?;
        }

        task_manager.add(o.clone(), app_handle).await;
    }

    app_handle.emit("overlay-update", "")?;

    windows
        .iter()
        .filter(|(label, _)| !new_windows.contains(label))
        .try_for_each(|w| {
            log::debug!("closing window: {}", w.0);
            w.1.destroy()
        })?;

    return Ok(());
}

pub fn load_overlays_async(app_handle: AppHandle) {
    tauri::async_runtime::block_on(async move { load_overlays(&app_handle).await }).unwrap_or_else(
        |e| {
            log::error!("Failed to load overlays: {}", e);
        },
    );
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            cmd::load_overlays,
            cmd::get_fonts,
            cmd::get_overlays,
            cmd::get_overlay,
            cmd::set_overlay,
            cmd::set_overlay_enabled,
            cmd::delete_overlay,
            cmd::get_settings,
            cmd::set_settings,
        ])
        .setup(|app| {
            let app_handle = app.handle();

            let result: Result<(), Error> = tauri::async_runtime::block_on(async move {
                let config_data = Config::load_from_file(&app_handle.clone())?;
                let only_overlays_on_start = config_data.settings.only_overlays_on_start;

                let config = Config {
                    app_handle: app_handle.clone(),
                    data: Arc::new(tokio::sync::Mutex::new(config_data)),
                };

                app_handle.manage(config);
                app_handle.manage(task::TaskManager::new());

                create_tray(&app_handle.clone())?;

                if !only_overlays_on_start {
                    show_or_create_window("main", app_handle)?;
                }

                load_overlays(&app_handle.clone()).await?;

                Ok(())
            });

            result.unwrap_or_else(|e| {
                log::error!("Failed to initialize application: {}", e);
                app_handle.exit(1);
            });

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                if window.label() != "main" {
                    return;
                }

                api.prevent_close();
                window.hide().unwrap();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
