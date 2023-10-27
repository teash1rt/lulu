/**
 * @meaning 文件或文件夹的数据信息
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
