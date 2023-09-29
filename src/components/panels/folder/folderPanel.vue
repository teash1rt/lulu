<template>
    <div class="folder-panel">
        <fileTree :fofInfo="fofInfo" v-if="fileStore.isOpen" />
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
}
</style>
