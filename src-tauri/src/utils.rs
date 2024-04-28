#[derive(Debug, thiserror::Error)]
pub enum Error {
    // #[error("unknown window label")]
    // InvalidWindowLabel,
    // #[error("no payload")]
    // NoPayload,
    // #[error("failed to load settings")]
    // SettingsLoadFailed,
    #[error(transparent)]
    Tauri(#[from] tauri::Error),
    #[error(transparent)]
    TauriPluginStore(#[from] tauri_plugin_store::Error),
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
