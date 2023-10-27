#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use file::{
    create_file, create_folder, create_folder_all, delete_file, open_folder, read_file,
    rename_file, write_file,
};
mod file;

use runner::run_code;
mod runner;

use kanban::{create_kanban, delete_kanban, get_kanban_list, read_kanban, save_kanban};
mod kanban;

use settings::{read_settings, save_settings};
mod settings;

use tauri::{
    api::path::{self},
    Config,
};

fn init() {
    if let Some(mut p) = path::app_data_dir(&Config::default()) {
        p.push("com.lulu");
        if !p.exists() {
            create_folder_all((&p.to_string_lossy()).to_string());
        }

        let settings_path = p.join("settings.json");
        if !settings_path.exists() {
            create_file((&settings_path.to_string_lossy()).to_string());
            write_file(
                (&settings_path.to_string_lossy()).to_string(),
                "{
                    \"common\": {
                      \"auto_save\": true,
                      \"open_in_browser\": true
                    },
                    \"display\": {
                      \"md_mode\": \"edit\",
                      \"md_code_theme\": \"obsidian\"
                    }
                  }"
                .to_string(),
            );
        }

        let kanban_path = p.join("kanban.json");
        if !kanban_path.exists() {
            create_file((&kanban_path.to_string_lossy()).to_string());
            write_file(
                (&kanban_path.to_string_lossy()).to_string(),
                "{\"kanban\": []}".to_string(),
            );
        }
    }
}

fn main() {
    init();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_folder,
            read_file,
            write_file,
            run_code,
            create_file,
            create_folder,
            delete_file,
            rename_file,
            read_kanban,
            save_kanban,
            get_kanban_list,
            create_kanban,
            delete_kanban,
            read_settings,
            save_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
