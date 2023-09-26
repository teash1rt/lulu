use crate::Fof;
use crate::STATIC_DIR;
use std::fs::OpenOptions;
use std::fs::{read_dir, File};
use std::io::{Read, Write};
use std::path::Path;
use tauri::command;
use uuid::Uuid;

pub static LEGAL_EXTENSIONS: [&str; 22] = [
    "md", "json", "txt", "css", "js", "ts", "jsx", "tsx", "py", "vue", "rs", "sh", "html", "yaml",
    "xml", "cpp", "c", "go", "java", "less", "sass", "lulu",
];

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
pub fn read_file(dir: String) -> String {
    let mut file = File::open(dir).unwrap();
    let mut buf = String::new();
    file.read_to_string(&mut buf).unwrap();
    buf
}

#[command]
pub fn write_file(dir: String, text: String) {
    let mut file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(dir)
        .unwrap();
    file.write_all(text.as_bytes()).unwrap();
}
