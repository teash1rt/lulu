<template>
    <div class="folder-panel">
        <div v-if="fileStore.isOpen">
            <div class="options">
                <svg-icon name="change" class="icon" color="#9e9e9e" @click="openFile" />
                <svg-icon name="new_file" class="icon" color="#9e9e9e" @click="createFile" />
                <svg-icon name="new_folder" class="icon" color="#9e9e9e" @click="createFolder" />
                <svg-icon
                    name="tree"
                    class="icon"
                    color="#9e9e9e"
                    @click="checkOutline"
                    v-if="mode === 'fileTree'" />
                <svg-icon
                    name="return"
                    class="icon"
                    color="#9e9e9e"
                    @click="mode = 'fileTree'"
                    v-else />
            </div>
            <fileTree :fofInfo="fofInfo" v-if="mode === 'fileTree'" />
            <div v-html="outLine" v-else />
        </div>
        <div v-else>
            <button class="open-button" @click="openFile">打开文件夹</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { open } from '@tauri-apps/api/dialog'
import { homeDir } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api/tauri'
import fileTree from './fileTree.vue'
import { listen } from '@tauri-apps/api/event'
import { FileStore } from '../../../stores/FileStore.ts'
import type { FofInfo } from '../../../types/FofInfo'
import { WebviewWindow } from '@tauri-apps/api/window'
import type { CreateFile } from '../../../types/CreateFile'
import { BusEvent } from '../../../types/BusEvent'
import { render } from '../../../utils/mdRender'
import type { CreateFolder } from '../../../types/CreateFolder'

const fofInfo = ref<FofInfo[]>([])
const fileStore = FileStore()
const mode = ref<'fileTree' | 'outLine'>('fileTree')

const openFile = async () => {
    const selected = (await open({
        directory: true,
        multiple: false,
        defaultPath: await homeDir()
    })) as string

    if (selected) {
        await getFileData(selected)
    }
}

const getFileData = async (path: string) => {
    fofInfo.value = await invoke('open_folder', { dir: path })
    fileStore.isOpen = true
    fileStore.fofInfo = fofInfo.value
    fileStore.openPath = path
}

const createFile = () => {
    new WebviewWindow('newFile', {
        url: 'windows/newFile/index.html',
        decorations: false,
        center: true,
        width: 500,
        height: 200,
        resizable: false,
        alwaysOnTop: true
    })
}

listen('createFile', async data => {
    const payload = data.payload as CreateFile
    let path = ''

    if (fileStore.lastSelect === null) {
        path = fileStore.openPath + '\\' + payload.fileName + '.' + payload.fileType
    } else if (fileStore.lastSelect.is_dir) {
        path = fileStore.lastSelect.file_path + '\\' + payload.fileName + '.' + payload.fileType
    } else {
        const lastIndex = fileStore.lastSelect.file_path.lastIndexOf('\\')
        path =
            fileStore.lastSelect.file_path.slice(0, lastIndex + 1) +
            payload.fileName +
            '.' +
            payload.fileType
    }
    await invoke('create_file', {
        path: path
    })
    await getFileData(fileStore.openPath)
})

const createFolder = () => {
    new WebviewWindow('newFolder', {
        url: 'windows/newFolder/index.html',
        decorations: false,
        center: true,
        width: 500,
        height: 170,
        resizable: false,
        alwaysOnTop: true
    })
}

listen('createFolder', async data => {
    const payload = data.payload as CreateFolder
    let path = ''
    if (fileStore.lastSelect === null) {
        path = fileStore.openPath + '\\' + payload.folderName
    } else if (fileStore.lastSelect.is_dir) {
        path = fileStore.lastSelect.file_path + '\\' + payload.folderName
    } else {
        const lastIndex = fileStore.lastSelect.file_path.lastIndexOf('\\')
        path = fileStore.lastSelect.file_path.slice(0, lastIndex) + payload.folderName
    }
    await invoke('create_folder', {
        path: path
    })
    await getFileData(fileStore.openPath)
})

const checkOutline = async () => {
    if (fileStore.filePath.endsWith('.md')) {
        mode.value = 'outLine'
        const mdContent = (await invoke('read_file', {
            path: fileStore.filePath
        })) as string
        render(mdContent)
    }
}

const outLine = ref<string>('')
listen(BusEvent.GetToc, data => {
    if (fileStore.filePath.endsWith('.md')) {
        outLine.value = data.payload as string
    }
})

onMounted(() => {
    if (fileStore.isOpen) {
        fofInfo.value = fileStore.fofInfo
    } else {
        listen('open_folder', event => {
            fofInfo.value = event.payload as FofInfo[]
        })
    }
})
</script>

<style lang="less" scoped>
.folder-panel {
    .open-button {
        color: #ffffff;
        background-color: #850bff;
        padding: 10px 25px;
        border-radius: 3px;
        cursor: pointer;
    }

    .options {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin: 5px 0 12px;
    }
}

.icon {
    width: 17px;
    height: 17px;
    cursor: pointer;
}
</style>
