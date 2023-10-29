<template>
    <div class="new-folder">
        <div class="navbar" data-tauri-drag-region>
            <div class="title">新建文件夹</div>
            <div @click="closeWindow" class="icon-box">
                <svg-icon name="close" color="#ccc" class="icon" />
            </div>
        </div>
        <div class="item">
            <span>文件夹名称</span>
            <input v-model="folderName" @keydown.enter="confirm" />
        </div>
        <div class="btn-group">
            <button class="cancel" @click="cancel">取 消</button>
            <button class="confirm" @click="confirm">确 定</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import { ref } from 'vue'
import { emit } from '@tauri-apps/api/event'
import { BusEvent } from '../../types/BusEvent'
import '../../styles/window.less'

const folderName = ref<string>('')

const closeWindow = () => {
    appWindow.close()
}

const cancel = () => {
    appWindow.close()
}

const confirm = async () => {
    await emit(BusEvent.CreateFolder, {
        folderName: folderName.value
    })
    appWindow.close()
}
</script>
