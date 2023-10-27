use crate::file::{read_file, write_file};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use tauri::command;
use tauri::{
    api::path::{self},
    Config,
};

#[derive(Debug, Serialize, Deserialize)]
struct SettingsCommon {
    auto_save: bool,
    open_in_browser: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct SettingsDisplay {
    md_mode: String,
    md_code_theme: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Settings {
    common: SettingsCommon,
    display: SettingsDisplay,
}

fn get_settings_path() -> String {
    let path = path::app_data_dir(&Config::default())
        .unwrap()
        .join("com.lulu")
        .join("settings.json")
        .to_string_lossy()
        .to_string();
    path
}

#[command]
pub fn read_settings() -> Settings {
    let path = get_settings_path();
    let content = read_file(path.clone());
    let data = from_str(&content).unwrap();
    data
}

#[command]
pub fn save_settings(settings: Settings) {
    let path = get_settings_path();
    let json_data = to_string(&settings).unwrap();
    write_file(path, json_data);
}
