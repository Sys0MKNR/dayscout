use humantime::format_duration;
use reqwest::{header, Client};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use url::{ParseError, Url};

use crate::settings::Overlay;
use crate::utils::Error;

pub async fn extend_overlay_with_external_data(
    client: &Client,
    overlay: &mut Overlay,
) -> Result<(), Error> {
    let mut req = client.get(build_url(&overlay.url, "/api/v1/status")?);
    req = req.header(header::ACCEPT, "application/json");

    req = req.query(&[("token", &overlay.token)]);
    let settings = req.send().await?;

    if !settings.status().is_success() {
        return Err(Error::Reqwest(settings.error_for_status().unwrap_err()));
    }

    let data = settings.json::<Value>().await?;
    let thresholds = &data["settings"]["thresholds"];

    if overlay.thresholds.high.is_none() {
        overlay.thresholds.high = thresholds["bgHigh"].as_f64();
    }

    if overlay.thresholds.low.is_none() {
        overlay.thresholds.low = thresholds["bgLow"].as_f64();
    }

    if overlay.thresholds.target_bottom.is_none() {
        overlay.thresholds.target_bottom = thresholds["bgTargetBottom"].as_f64();
    }

    if overlay.thresholds.target_top.is_none() {
        overlay.thresholds.target_top = thresholds["bgTargetTop"].as_f64();
    }
    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
struct INSSGV {
    pub direction: String,
    pub scaled: f64,
    pub mills: u64,
}

#[derive(Debug, Serialize, Deserialize)]
struct BGNOW {
    pub sgvs: Vec<INSSGV>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Delta {
    pub absolute: f64,
    pub display: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct StatusResponse {
    pub bgnow: BGNOW,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub delta: Option<Delta>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
enum State {
    Urgent,
    Warn,
    Ok,
}

fn get_status_state(overlay: &Overlay, value: f64) -> State {
    if overlay.thresholds.low.map_or(false, |low| value < low) {
        return State::Urgent;
    } else if overlay
        .thresholds
        .target_bottom
        .map_or(false, |bottom| value < bottom)
    {
        return State::Warn;
    } else if overlay
        .thresholds
        .target_top
        .map_or(false, |top| value < top)
    {
        return State::Ok;
    } else if overlay.thresholds.high.map_or(false, |high| value < high) {
        return State::Warn;
    }

    State::Urgent
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Status {
    delta: Option<f64>,
    delta_text: Option<String>,
    direction: String,
    last_updated_text: String,
    state: State,
    timestamp: u64,
    value: f64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct StatusPayload {
    pub overlay_id: String,
    pub error_count: u8,
    pub stopped: bool,
    pub data: Option<Status>,
    pub error: Option<String>,
}

impl StatusPayload {
    pub fn from_result(
        overlay_id: String,
        result: Result<Status, Error>,
        error_count: u8,
        stopped: bool,
    ) -> Self {
        match result {
            Ok(status) => StatusPayload {
                overlay_id,
                error_count,
                stopped,
                data: Some(status),
                error: None,
            },
            Err(e) => StatusPayload {
                overlay_id,
                error_count,
                stopped,
                data: None,
                error: Some(e.to_string()),
            },
        }
    }
}

pub async fn get_status(client: &Client, overlay: &Overlay) -> Result<Status, Error> {
    let mut req = client.get(build_url(&overlay.url, "/api/v2/properties")?);
    req = req.header(header::ACCEPT, "application/json");
    req = req.query(&[("token", &overlay.token)]);
    let settings = req.send().await?;
    if !settings.status().is_success() {
        return Err(Error::Reqwest(settings.error_for_status().unwrap_err()));
    }

    let data = settings.json::<StatusResponse>().await?;

    let value = data.bgnow.sgvs.get(0).ok_or_else(|| Error::CustomError {
        msg: "No SGV data found".to_string(),
    })?;
    let timestamp = UNIX_EPOCH + Duration::from_millis(value.mills);
    let duration = SystemTime::now().duration_since(timestamp)?;

    Ok(Status {
        delta: data.delta.as_ref().map(|d| d.absolute),
        delta_text: data.delta.as_ref().map(|d| d.display.clone()),
        direction: value.direction.clone(),
        last_updated_text: format_duration(duration).to_string(),
        state: get_status_state(&overlay, value.scaled),
        timestamp: value.mills,
        value: value.scaled,
    })
}

pub fn build_url(base_url: &str, path: &str) -> Result<Url, ParseError> {
    let base = Url::parse(base_url)?;
    let joined = base.join(path)?;

    Ok(joined)
}
