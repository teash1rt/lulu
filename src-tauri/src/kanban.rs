use crate::file::{read_file, write_file};
use serde::{Deserialize, Serialize};
use serde_json::{from_str, to_string};
use tauri::command;
use tauri::{
    api::path::{self},
    Config,
};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KanbanColumn {
    column_type: String,
    content: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct KanbanInfo {
    id: String,
    name: String,
    info: Vec<KanbanColumn>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Kanban {
    kanban: Vec<KanbanInfo>,
}

#[derive(Debug, Serialize)]
pub struct KanbanListItem {
    id: String,
    name: String,
}

#[derive(Debug, Serialize)]
pub struct KanbanDetails {
    path: String,
    data: Kanban,
}

fn get_kanban_details() -> KanbanDetails {
    let path = path::app_data_dir(&Config::default())
        .unwrap()
        .join("com.lulu")
        .join("kanban.json")
        .to_string_lossy()
        .to_string();
    let content = read_file(path.clone());
    let data: Kanban = from_str(&content).unwrap();
    KanbanDetails { path, data }
}

#[command]
pub fn get_kanban_list() -> Vec<KanbanListItem> {
    let data = get_kanban_details().data;
    let mut kanban_list: Vec<KanbanListItem> = Vec::new();

    for kanban in data.kanban {
        kanban_list.push(KanbanListItem {
            id: kanban.id,
            name: kanban.name,
        });
    }
    kanban_list
}

#[command]
pub fn read_kanban(id: String) -> Vec<KanbanColumn> {
    let data = get_kanban_details().data;
    let mut column: Vec<KanbanColumn> = Vec::new();
    for kanban in data.kanban {
        if kanban.id == id {
            column = kanban.info
        }
    }
    column
}

#[command]
pub fn create_kanban(name: String) {
    let details = get_kanban_details();
    let mut data = details.data;
    let id = Uuid::new_v4().to_string();
    data.kanban.push(KanbanInfo {
        id: id[0..8].to_string(),
        name,
        info: [
            KanbanColumn {
                column_type: "To do".to_string(),
                content: [].to_vec(),
            },
            KanbanColumn {
                column_type: "In progress".to_string(),
                content: [].to_vec(),
            },
            KanbanColumn {
                column_type: "Completed".to_string(),
                content: [].to_vec(),
            },
        ]
        .to_vec(),
    });
    let json_data = to_string(&data).unwrap();
    write_file(details.path, json_data);
}

#[command]
pub fn delete_kanban(id: String) {
    let details = get_kanban_details();
    let mut data = details.data;
    data.kanban.retain(|kanban| kanban.id != id);
    let json_data = to_string(&data).unwrap();
    write_file(details.path, json_data);
}

#[command]
pub fn save_kanban(id: String, columns: Vec<KanbanColumn>) {
    let details = get_kanban_details();
    let mut data = details.data;
    for kanban in &mut data.kanban {
        if kanban.id == id {
            let kanban_column: Vec<KanbanColumn> = from_str(&to_string(&columns).unwrap()).unwrap();
            kanban.info = kanban_column;
            break;
        }
    }
    let json_data = to_string(&data).unwrap();
    write_file(details.path, json_data);
}
