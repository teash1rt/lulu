<template>
    <div class="new-file">
        <div class="navbar" data-tauri-drag-region>
            <div class="title">新建文件</div>
            <div @click="closeWindow" class="icon-box">
                <svg-icon name="close" color="#ccc" class="icon" />
            </div>
        </div>
        <div class="item">
            <span>文件名称</span>
            <input v-model="fileName" @keydown.enter="confirm" />
        </div>
        <div class="item">
            <span>文件类型 </span>
            <span>
                <input type="radio" v-model="fileType" value="lulu" checked />
                lulu
                <input type="radio" v-model="fileType" value="md" />
                markdown
            </span>
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
import '../../styles/window.less'
import { BusEvent } from '../../types/BusEvent'

const fileName = ref<string>('')
const fileType = ref<'lulu' | 'md'>('lulu')

const closeWindow = () => {
    appWindow.close()
}

const cancel = () => {
    appWindow.close()
}

const confirm = async () => {
    await emit(BusEvent.CreateFile, {
        fileName: fileName.value,
        fileType: fileType.value
    })
    appWindow.close()
}
</script>
