use reqwest::Client;
use std::time::Duration;
use tauri::{AppHandle, Emitter};

use tokio::time::interval;

use crate::{
    api::{extend_overlay_with_external_data, get_status, StatusPayload},
    config::Overlay,
};

pub struct TaskManager {
    client: Client,
    tasks: std::sync::Arc<
        tokio::sync::RwLock<std::collections::HashMap<String, tokio::task::JoinHandle<()>>>,
    >,
}

impl TaskManager {
    pub fn new() -> Self {
        Self {
            client: Client::new(),
            tasks: std::sync::Arc::new(tokio::sync::RwLock::new(std::collections::HashMap::new())),
        }
    }

    pub async fn add(&self, mut overlay: Overlay, app_handle: &AppHandle) {
        let client = self.client.clone();
        let tasks = self.tasks.clone();
        let req_id = overlay.id.clone();

        let handle = app_handle.clone();

        let task = tokio::spawn(async move {
            let res = extend_overlay_with_external_data(&client, &mut overlay).await;

            if res.is_err() {
                let payload = StatusPayload {
                    overlay_id: overlay.id.clone(),
                    data: None,
                    error: Some(res.unwrap_err().to_string()),
                    error_count: 1,
                    stopped: true,
                };

                log::error!("{:?}", payload);
                handle.emit("status-update", payload).unwrap();
                return;
            }

            let mut interval = interval(Duration::from_secs_f32(overlay.fetch_interval));

            let mut error_count = 0;
            let max_errors = 5;

            loop {
                interval.tick().await;
                let status = get_status(&client, &overlay).await;
                let mut stop = false;

                if status.is_err() {
                    error_count += 1;
                    if error_count > max_errors {
                        stop = true;
                    }
                } else {
                    error_count = 0;
                }

                let payload =
                    StatusPayload::from_result(overlay.id.clone(), status, error_count, stop);

                log::debug!("{:?}", payload);

                handle.emit("status-update", payload).unwrap();
                if stop {
                    break;
                }
            }
        });

        let mut tasks_lock = tasks.write().await;
        if let Some(old_task) = tasks_lock.insert(req_id, task) {
            old_task.abort();
        }
    }

    pub async fn stop(&self, id: &str) -> bool {
        let mut tasks_lock = self.tasks.write().await;
        if let Some(task) = tasks_lock.remove(id) {
            task.abort();
            true
        } else {
            false
        }
    }

    pub async fn stop_all(&self) {
        let mut tasks_lock = self.tasks.write().await;
        for (_, task) in tasks_lock.drain() {
            task.abort();
        }
    }
}
