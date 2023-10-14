<template>
    <div class="folder-panel">
        <div v-if="fileStore.isOpen">
            <div class="options">
                <svg-icon name="new_file" class="icon" color="#9e9e9e" @click="createFile" />
                <svg-icon name="new_folder" class="icon" color="#9e9e9e" @click="createFolder" />
                <svg-icon name="tree" class="icon" color="#9e9e9e" @click="checkOutline" />
            </div>
            <fileTree :fofInfo="fofInfo" />
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

const fofInfo = ref<FofInfo[]>([])
const fileStore = FileStore()

const openFile = async () => {
    const selected = await open({
        directory: true,
        multiple: false,
        defaultPath: await homeDir()
    })

    if (selected) {
        fofInfo.value = await invoke('open_folder', { dir: selected })
        fileStore.isOpen = true
        fileStore.fofInfo = fofInfo.value
    }
}

const createFile = () => {}

const createFolder = () => {}

const checkOutline = () => {}

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
}
</style>
