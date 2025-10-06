use std::{fs::OpenOptions, io::Read};

use crate::utils::Error;
use serde::{Deserialize, Serialize};
use serde_json::{self, error::Category};
use tauri::{AppHandle, Manager, PhysicalPosition};
use tauri_plugin_positioner::Position;

fn blank_to_none<'de, D>(deserializer: D) -> Result<Option<f64>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let opt = Option::<serde_json::Value>::deserialize(deserializer)?;
    match opt {
        None | Some(serde_json::Value::Null) => Ok(None),
        Some(serde_json::Value::String(ref s)) if s.trim().is_empty() => Ok(None),
        Some(serde_json::Value::Number(n)) => n
            .as_f64()
            .map(Some)
            .ok_or_else(|| serde::de::Error::custom("Invalid number")),
        Some(other) => Err(serde::de::Error::custom(format!(
            "Unexpected value: {:?}",
            other
        ))),
    }
}

pub const CONFIG_PATH: &str = "config.json";

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    #[serde(default)]
    pub quit_on_close: bool,
    #[serde(default)]
    pub start_on_startup: bool,
    #[serde(default)]
    pub only_overlays_on_start: bool,
}

#[derive(Serialize, Deserialize, Clone, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Thresholds {
    #[serde(default, deserialize_with = "blank_to_none")]
    pub high: Option<f64>,
    #[serde(default, deserialize_with = "blank_to_none")]
    pub low: Option<f64>,
    #[serde(default, deserialize_with = "blank_to_none")]
    pub target_bottom: Option<f64>,
    #[serde(default, deserialize_with = "blank_to_none")]
    pub target_top: Option<f64>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum PositionType {
    Preset,
    Custom,
    Manual,
}

#[derive(Serialize, Deserialize, Clone, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Colors {
    pub urgent: String,
    pub warn: String,
    pub ok: String,
    pub background: String,
}

#[derive(Serialize, Deserialize, Clone, Default, Debug)]
#[serde(rename_all = "camelCase")]
pub struct StatusItem {
    pub enabled: bool,
    pub size: u8,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct StatusItems {
    pub value: StatusItem,
    pub icon: StatusItem,
    pub delta: StatusItem,
    pub last_updated: StatusItem,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Overlay {
    pub id: String,
    pub name: String,
    pub enabled: bool,
    pub all_monitors: bool,
    pub monitors: Vec<String>,
    pub url: String,
    pub token: String,
    pub fetch_interval: f32,
    pub thresholds: Thresholds,
    pub position: PositionType,
    pub custom_position: PhysicalPosition<i32>,
    pub preset_position: String,
    pub width: u32,
    pub height: u32,
    pub interactive: bool,
    pub opacity: u8,
    pub padding: u32,
    pub transparent: bool,
    pub font: String,
    pub colors: Colors,
    pub status_items: StatusItems,
}

impl Overlay {
    pub fn get_preset_position(&self) -> Result<Position, Error> {
        serde_json::from_str(self.preset_position.as_str()).map_err(Error::from)
    }
}

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct ConfigData {
    pub settings: Settings,
    #[serde(default)]
    pub overlays: Vec<Overlay>,
}

pub struct Config {
    pub app_handle: AppHandle,
    pub data: std::sync::Arc<tokio::sync::Mutex<ConfigData>>,
}

impl Config {
    pub fn load_from_file(app_handle: &AppHandle) -> Result<ConfigData, Error> {
        let config_path = app_handle.path().app_config_dir()?.join(CONFIG_PATH);

        let mut f = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .open(config_path)?;

        let mut buffer = String::new();
        f.read_to_string(&mut buffer)?;

        let config = serde_json::from_str(buffer.as_str());
        let config = match config {
            Ok(s) => s,
            Err(e) => match e.classify() {
                Category::Eof => ConfigData::default(),
                _ => return Err(Error::from(e)),
            },
        };

        Ok(config)
    }

    pub async fn load(&mut self) -> Result<&Self, Error> {
        let config = Self::load_from_file(&self.app_handle)?;
        let mut self_data = self.data.lock().await;
        self_data.settings = config.settings.clone();
        self_data.overlays = config.overlays.clone();

        Ok(self)
    }

    pub async fn save(&self, config_data: &ConfigData) -> Result<(), Error> {
        let dir = self.app_handle.path().app_config_dir()?.join(CONFIG_PATH);
        let config_json = serde_json::to_string_pretty(config_data)?;
        tokio::fs::write(dir, config_json).await?;
        Ok(())
    }

    pub async fn set_settings(&self, settings: Settings) -> Result<(), Error> {
        let mut data = self.data.lock().await;
        data.settings = settings;
        self.save(&data).await?;

        Ok(())
    }

    pub async fn get_overlay(&self, id: &str) -> Result<Option<Overlay>, Error> {
        log::debug!("get_overlay: {}", id);
        let data = self.data.lock().await;
        let o = data.overlays.iter().find(|o| o.id == id).cloned();
        log::debug!("get_overlay: {:?}", o);
        Ok(o)
    }

    pub async fn get_overlays(&self) -> Result<Vec<Overlay>, Error> {
        let data = self.data.lock().await;
        Ok(data.overlays.clone())
    }

    pub async fn set_overlay(&self, overlay: Overlay) -> Result<(), Error> {
        let mut data = self.data.lock().await;
        if let Some(existing) = data.overlays.iter_mut().find(|o| o.id == overlay.id) {
            *existing = overlay;
        } else {
            data.overlays.push(overlay);
        }
        self.save(&data).await?;

        Ok(())
    }

    pub async fn set_overlay_enabled(&self, id: &str, enabled: bool) -> Result<(), Error> {
        let mut data = self.data.lock().await;
        if let Some(existing) = data.overlays.iter_mut().find(|o| o.id == id) {
            existing.enabled = enabled;
        }
        self.save(&data).await?;

        Ok(())
    }

    pub async fn delete_overlay(&self, id: &str) -> Result<(), Error> {
        let mut data = self.data.lock().await;
        data.overlays.retain(|o| o.id != id);

        self.save(&data).await?;

        Ok(())
    }
}
