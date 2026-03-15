use std::fs::OpenOptions;

use crate::{overlay::Overlay, utils::Error};
use font_kit::{error::SelectionError, source::SystemSource};
use serde::{Deserialize, Serialize};
use serde_json::{self, error::Category};
use tauri::{AppHandle, Manager};

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

#[derive(Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct ConfigData {
    pub settings: Settings,
    #[serde(default)]
    pub overlays: Vec<Overlay>,
    #[serde(skip)]
    pub fonts: Vec<String>,
}

pub struct Config {
    pub app_handle: AppHandle,
    pub data: std::sync::Arc<tokio::sync::Mutex<ConfigData>>,
}

impl Config {
    pub fn load_from_file(app_handle: &AppHandle) -> Result<ConfigData, Error> {
        let config_path = app_handle.path().app_config_dir()?.join(CONFIG_PATH);

        let f = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .open(config_path)?;

        let config = serde_json::from_reader(f);

        let mut config = match config {
            Ok(s) => s,
            Err(e) => match e.classify() {
                Category::Eof => ConfigData::default(),
                _ => return Err(Error::from(e)),
            },
        };

        let source: SystemSource = SystemSource::new();
        let fonts: Result<Vec<String>, SelectionError> = source.all_families();

        let mut fonts = if let Ok(font) = fonts { font } else { vec![] };
        fonts.sort();

        config.fonts = fonts;

        Ok(config)
    }

    // pub async fn load(&mut self) -> Result<&Self, Error> {
    //     let config = Self::load_from_file(&self.app_handle)?;
    //     let mut self_data = self.data.lock().await;
    //     self_data.settings = config.settings.clone();
    //     self_data.overlays = config.overlays.clone();
    //     self_data.fonts = config.fonts.clone();

    //     Ok(self)
    // }

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
        let data = self.data.lock().await;
        let o = data.overlays.iter().find(|o| o.id == id).cloned();
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
