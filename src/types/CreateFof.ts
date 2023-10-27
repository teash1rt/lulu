/**
 * @meaning 新建文件时的回调类型
 */

export type CreateFile = {
    fileName: string
    fileType: 'md' | 'lulu'
}

/**
 * @meaning 新建文件夹时的回调类型
 */

export type CreateFolder = {
    folderName: string
}
