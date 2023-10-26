<template>
    <div class="kanban-panel">
        <div class="common-button" @click="handleAdd">
            <svg-icon name="plus" color="#ffffff" class="icon" />
            添加看板
        </div>
        <kanbanList />
    </div>
</template>

<script setup lang="ts">
import kanbanList from './kanbanList.vue'
import { WebviewWindow } from '@tauri-apps/api/window'

const handleAdd = async () => {
    new WebviewWindow('newKanban', {
        url: 'windows/newKanban/index.html',
        decorations: false,
        center: true,
        width: 500,
        height: 170,
        resizable: false,
        alwaysOnTop: true
    })
}
</script>

<style lang="less" scoped>
.icon {
    width: 23px;
    height: 23px;
    margin-right: 5px;
}
</style>
