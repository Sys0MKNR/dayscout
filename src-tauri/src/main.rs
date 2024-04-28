#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::collections::HashMap;
use std::path::PathBuf;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, Window};

use tauri::Wry;
use tauri_plugin_store::{with_store, StoreCollection};

mod cmd;
mod tray;
mod utils;
mod window;

use cmd::{show_or_create_window_cmd, toggle_window_cmd, update_settings_cmd};
use tray::{create_tray, handle_tray};

use utils::Error;
use window::{create_main_window, create_settings_window};
#[derive(Serialize, Deserialize, Clone)]
struct SettingsWindow {
    id: String,
    name: String,
    profile: Option<String>,
    monitor: Option<String>,
    enabled: bool,
}

#[derive(Serialize, Deserialize)]
struct Settings {
    window: Vec<SettingsWindow>,
}

fn load_setings(handle: AppHandle) -> Result<Settings, Error> {
    let stores = handle.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(".settings.json");

    let settings = with_store(handle.clone(), stores, path.clone(), |store| {
        let settings = store.get("settings");

        match settings {
            Some(s) => {
                let settings: Settings = serde_json::from_value(s.clone())?;
                Ok(settings)
            }
            None => Err(tauri_plugin_store::Error::NotFound(path.clone())),
        }
    });

    match settings {
        Ok(s) => Ok(s),
        Err(e) => Err(Error::from(e)),
    }
}

fn update_windows(handle: AppHandle) {
    let settings = load_setings(handle.clone()).unwrap();

    let mut windows: HashMap<String, Window> = handle.windows();
    windows.remove("settings");

    settings.window.iter().for_each(|sw| {
        if !sw.enabled {
            return;
        }

        let w = match handle.get_window(sw.id.as_str()) {
            Some(w) => {
                windows.remove(sw.id.as_str());
                w
            }
            None => {
                let profile: String = sw.profile.clone().unwrap_or("".to_string());
                create_main_window(sw.id.as_str(), profile.as_str(), &handle).unwrap()
            }
        };

        w.show().unwrap();
        // w.emit("settings", sw).unwrap();
    });

    windows.iter().for_each(|w| {
        w.1.close().unwrap();
    });

    //     // println!("settings: {:?}", settings);
    // }

    // handle.windows().iter().for_each(|item| {
    //     let w: &tauri::Window = item.1;

    //     println!("window: {:?}", w.label());

    //     let early_return = match w.label() {
    //         "settings" => true,
    //         _ => false,
    //     };

    //     if early_return {
    //         return;
    //     }

    //     let index = settings.window.iter().position(|sw| sw.id == w.label());

    //     match index {
    //         Some(i) => {
    //             let s = settings.window[i].clone();
    //             settings.window.remove(i);

    //             if s.enabled {
    //                 let profile: String = s.profile.clone().unwrap_or("".to_string());

    //                 let params = HashMap::from([("profile".to_string(), profile.as_str())]);

    //                 show_or_create_window(w.label(), &handle, Some(params)).unwrap();
    //             } else {
    //                 w.close().unwrap();
    //             }
    //         }
    //         None => {
    //             w.close().unwrap();
    //         }
    //     }
}

fn main() {
    let tray = create_tray();

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_positioner::init())
        .system_tray(tray)
        .on_system_tray_event(handle_tray)
        .setup(|app| {
            let handle = app.handle();

            let w = create_settings_window(&handle).unwrap();

            w.show().unwrap();

            app.listen_global("settings-updated", move |event| {
                update_windows(handle.clone());
            });
            //     let mut settings: Settings =
            //         serde_json::from_str(event.payload().unwrap()).unwrap();

            //     // handle.windows().iter().for_each(|w| {
            //     //     if w.1.label() == "settings" {
            //     //         return;
            //     //     }

            //     //     w.1.close().unwrap();
            //     // });

            //     // handle.windows().iter().for_each(|w| {
            //     //     println!("window: {:?}", w.1.label());
            //     // });

            //     // settings.window.iter().for_each(|s| {
            //     //     if s.enabled {
            //     //         let profile: String = s.profile.clone().unwrap_or("".to_string());

            //     //         let params = HashMap::from([("profile".to_string(), profile.as_str())]);

            //     //         show_or_create_window(s.id.as_str(), &handle, Some(params)).unwrap();
            //     //     }
            //     // });
            // });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            show_or_create_window_cmd,
            toggle_window_cmd,
            update_settings_cmd,
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, _event| {});
}
