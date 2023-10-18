use std::process::Command;
use std::time::Instant;
use tauri::command;

#[derive(Debug, Clone, serde::Serialize)]
pub struct Result {
    status: String,
    message: String,
    time: f64,
}

#[command]
pub fn run_code(code: String) -> Result {
    let start = Instant::now();
    let output = Command::new("node").arg("-e").arg(code).output().unwrap();
    let duration = start.elapsed().as_secs_f64();

    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        Result {
            status: "success".to_string(),
            message: stdout.to_string(),
            time: format!("{:.1}", duration).parse().unwrap(),
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Result {
            status: "error".to_string(),
            message: stderr.to_string(),
            time: format!("{:.1}", duration).parse().unwrap(),
        }
    }
}
