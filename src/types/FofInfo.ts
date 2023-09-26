/**
 * @from main.rs
 * pub struct Fof {
 *  id: String,
 *  name: String,
 *  level: u32,
 *  is_dir: bool,
 *  file_path: String,
 *  extension: String,
 *  children: Vec<Fof>,
 * }
 */

/**
 * @meaning file or folder
 */
export type FofInfo = {
    id: string
    name: string
    level: number
    is_dir: boolean
    file_path: string
    extension: string
    children: FofInfo[]
}
