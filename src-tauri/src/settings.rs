use crate::utils::Error;
use serde::{Deserialize, Serialize};
use serde_json;
use tauri::{AppHandle, PhysicalPosition};
use tauri_plugin_positioner::Position;
use tauri_plugin_store::StoreExt;

pub const SETTINGS_PATH: &str = ".settings.json";

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct General {
    pub quit_on_close: bool,
    pub start_on_startup: bool,
    pub only_overlays_on_start: bool,
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct Thresholds {
    pub high: Option<f64>,
    pub low: Option<f64>,
    pub target_bottom: Option<f64>,
    pub target_top: Option<f64>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Overlay {
    pub id: String,
    pub name: String,
    pub enabled: bool,
    pub all_monitors: bool,
    pub monitors: Vec<String>,
    pub url: String,
    pub token: String,
    pub fetch_interval: u64,
    pub thresholds: Thresholds,
    pub position: String,
    pub custom_position: PhysicalPosition<i32>,
    pub preset_position: String,
    pub width: u32,
    pub height: u32,
    pub interactive: bool,
}

impl Overlay {
    pub fn get_preset_position(&self) -> Result<Position, Error> {
        serde_json::from_str(self.preset_position.as_str()).map_err(Error::from)
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub general: General,
    pub overlays: Vec<Overlay>,
}

pub fn load_setings(app: &AppHandle) -> Result<Settings, Error> {
    let store = app.store(SETTINGS_PATH)?;

    let overlays = serde_json::from_value::<Vec<Overlay>>(
        store.get("overlays").ok_or(Error::InvalidSettingsFile)?,
    )?;

    let general =
        serde_json::from_value::<General>(store.get("general").ok_or(Error::InvalidSettingsFile)?)?;

    Ok(Settings {
        overlays: overlays,
        general: general,
    })
}
