use crate::{load_overlays as load_overlays_handler , utils};
use font_kit::{error::SelectionError, source::SystemSource};

  
  #[tauri::command]
  pub async fn load_overlays(app_handle: tauri::AppHandle) -> Result<(), String> {
      load_overlays_handler(&app_handle)
          .await
          .map_err(|e| utils::Error::OverlaysLoadFailed { err: e.to_string() }.to_string())?;

      Ok(())
  }


  #[tauri::command]
  pub async fn font_families() -> Vec<std::string::String> {
      let source = SystemSource::new();
      let fonts: Result<Vec<String>, SelectionError> = source.all_families();
      if let Ok(font) = fonts {
          font
      } else {
          vec![]
      }
  }



