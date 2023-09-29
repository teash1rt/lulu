#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use file::{create_file, delete_file, open_folder, read_file, rename_file, write_file};
mod file;

use runner::run_code;
mod runner;

#[derive(Debug, Clone, serde::Serialize)]

// file or folder
pub struct Fof {
    name: String,
    id: String,
    level: u32,
    is_dir: bool,
    file_path: String,
    extension: String,
    children: Vec<Fof>,
}

static mut STATIC_DIR: &str = "";
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_folder,
            read_file,
            write_file,
            run_code,
            create_file,
            delete_file,
            rename_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
