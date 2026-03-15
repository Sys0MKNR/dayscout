use crate::utils::Error;
use serde::{Deserialize, Serialize};
use serde_json::{self};
use tauri::PhysicalPosition;
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
