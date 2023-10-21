use crate::file::read_file;
use serde::{Deserialize, Serialize};
use serde_json::from_str;
use tauri::command;
use tauri::{
    api::path::{self},
    Config,
};

#[derive(Debug, Serialize, Deserialize)]
struct KanbanColumn {
    column_type: String,
    content: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct KanbanInfo {
    id: String,

    info: Vec<KanbanColumn>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Kanban {
    kanban: Vec<KanbanInfo>,
}

#[command]
pub fn read_kanban_list() {
    let p = path::app_data_dir(&Config::default())
        .unwrap()
        .join("com.lulu")
        .join("kanban.json")
        .to_string_lossy()
        .to_string();
    let content = read_file(p);
    let data: Kanban = from_str(&content).unwrap();

    // 输出id属性的值
    for kanban in data.kanban {
        println!("id: {}", kanban.id);
    }
}
