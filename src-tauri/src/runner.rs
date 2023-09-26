use std::process::Command;

use tauri::command;

#[derive(Debug, Clone, serde::Serialize)]
pub struct Result {
    status: String,
    message: String,
}

#[command]
pub fn run_code(code: String) -> Result {
    let output = Command::new("node")
        .arg("-e")
        .arg(code)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command"));

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        Result {
            status: "success".to_string(),
            message: stdout.to_string(),
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Result {
            status: "error".to_string(),
            message: stderr.to_string(),
        }
    }
}
