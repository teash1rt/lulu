use std::fs::{read_dir, remove_file, rename, File, OpenOptions};
use std::io::{Read, Write};
use std::path::Path;
use tauri::command;
use uuid::Uuid;

pub static LEGAL_EXTENSIONS: [&str; 22] = [
    "md", "json", "txt", "css", "js", "ts", "jsx", "tsx", "py", "vue", "rs", "sh", "html", "yaml",
    "xml", "cpp", "c", "go", "java", "less", "sass", "lulu",
];

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

fn read_folder(path: &Path, mut level: u32) -> Vec<Fof> {
    level += 1;
    let paths = read_dir(path).unwrap();
    let mut folder_arr: Vec<Fof> = Vec::new();
    for p in paths {
        let uuid = Uuid::new_v4();
        let id = uuid.to_string().replace("-", "");

        let pb = p.unwrap().path();
        let name = pb
            .file_name()
            .unwrap()
            .to_os_string()
            .into_string()
            .unwrap();

        let is_dir = pb.is_dir();

        let mut folder = Fof {
            name,
            id,
            level,
            is_dir,
            file_path: pb.as_path().to_str().unwrap().to_string(),
            extension: String::new(),
            children: Vec::new(),
        };
        if is_dir {
            folder.children = read_folder(pb.as_path(), level);
        }

        match pb.extension() {
            Some(val) => folder.extension = val.to_os_string().into_string().unwrap(),
            None => {}
        }

        if LEGAL_EXTENSIONS.contains(&folder.extension.as_str()) || folder.is_dir {
            folder_arr.push(folder);
        }
    }
    folder_arr
}

#[command]
pub fn open_folder(dir: String) -> Vec<Fof> {
    unsafe {
        STATIC_DIR = Box::leak(dir.into_boxed_str());
        let path = Path::new(STATIC_DIR);
        read_folder(path, 0)
    }
}

#[command]
pub fn read_file(path: String) -> String {
    let mut file = File::open(path).unwrap();
    let mut buf = String::new();
    file.read_to_string(&mut buf).unwrap();
    buf
}

#[command]
pub fn write_file(path: String, text: String) {
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(path)
        .unwrap();
    file.write_all(text.as_bytes()).unwrap();
}

#[command]
pub fn create_file(path: String) {
    File::create(path).unwrap();
}

#[command]
pub fn delete_file(path: String) {
    remove_file(path).unwrap();
}

#[command]
pub fn rename_file(old_path: String, new_path: String) {
    rename(old_path, new_path).unwrap();
}
