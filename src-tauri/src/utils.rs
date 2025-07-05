#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("invalid settings file")]
    InvalidSettingsFile,
    #[error("task manager not found")]
    TaskManagerNotFound,
    #[error("failed to reload overlays: {err:?} ")]
    OverlaysLoadFailed { err: String },
    #[error("{msg:?}")]
    CustomError { msg: String },
    #[error(transparent)]
    Tauri(#[from] tauri::Error),
    #[error(transparent)]
    TauriPluginStore(#[from] tauri_plugin_store::Error),
    #[error(transparent)]
    Serde(#[from] serde_json::Error),
    #[error(transparent)]
    ParseError(#[from] url::ParseError),
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),
    #[error(transparent)]
    SystemTimeError(#[from] std::time::SystemTimeError),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
