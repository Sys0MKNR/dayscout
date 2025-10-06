use crate::{
    config::{Config, Overlay, Settings},
    load_overlays as load_overlays_handler, utils,
};
use font_kit::{error::SelectionError, source::SystemSource};

#[tauri::command]
pub async fn load_overlays(app_handle: tauri::AppHandle) -> Result<(), String> {
    load_overlays_handler(&app_handle)
        .await
        .map_err(|e| utils::Error::OverlaysLoadFailed { err: e.to_string() }.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_fonts() -> Vec<std::string::String> {
    let source: SystemSource = SystemSource::new();
    let fonts: Result<Vec<String>, SelectionError> = source.all_families();
    if let Ok(font) = fonts {
        font
    } else {
        vec![]
    }
}

#[tauri::command]
pub async fn get_settings(config: tauri::State<'_, Config>) -> Result<Settings, String> {
    let config = config.data.lock().await;
    Ok(config.settings.clone())
}

#[tauri::command]
pub async fn set_settings(
    settings: Settings,
    config: tauri::State<'_, Config>,
) -> Result<(), String> {
    config
        .set_settings(settings)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_overlays(config: tauri::State<'_, Config>) -> Result<Vec<Overlay>, String> {
    config.get_overlays().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_overlay(
    id: String,
    config: tauri::State<'_, Config>,
) -> Result<Option<Overlay>, String> {
    config.get_overlay(&id).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_overlay(overlay: Overlay, config: tauri::State<'_, Config>) -> Result<(), String> {
    config.set_overlay(overlay).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_overlay_enabled(
    id: String,
    enabled: bool,
    config: tauri::State<'_, Config>,
) -> Result<(), String> {
    config
        .set_overlay_enabled(&id, enabled)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_overlay(id: String, config: tauri::State<'_, Config>) -> Result<(), String> {
    config.delete_overlay(&id).await.map_err(|e| e.to_string())
}
