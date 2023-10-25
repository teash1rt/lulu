<template>
    <div class="side-bar">
        <div class="bar">
            <svg-icon name="folder" class="icon" @click="handlePick(markRaw(folderPanel))" />
            <svg-icon name="kanban" class="icon" @click="handlePick(markRaw(kanbanPanel))" />
            <svg-icon name="settings" class="icon" @click="handlePickSettings" />
        </div>
        <div class="panel" v-show="expandComponent">
            <keep-alive>
                <component :is="expandComponent" />
            </keep-alive>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import type { Raw } from 'vue'
import folderPanel from '../panels/folder/folderPanel.vue'
import kanbanPanel from '../panels/kanban/kanbanPanel.vue'
import { useRouter } from 'vue-router'

const expandComponent = ref<Raw<typeof folderPanel> | null>(null)

const handlePick = (component: Raw<typeof folderPanel | typeof kanbanPanel>) => {
    expandComponent.value = expandComponent.value === component ? null : component
}

const router = useRouter()
const handlePickSettings = () => {
    router.push({ name: 'settings' })
}
</script>

<style lang="less" scoped>
.side-bar {
    display: flex;
    background-color: #252526;
    height: 100%;

    .bar {
        display: flex;
        flex-direction: column;
        width: 50px;
        gap: 30px;
        border-right: 1px solid #30363d;
        margin-top: 10px;
    }

    .panel {
        width: 320px;
        height: 100%;
        overflow: auto;
    }
}

.icon {
    margin: 0 auto;
    width: 30px;
    height: 30px;
    cursor: pointer;
}

.icon:nth-child(3) {
    margin: auto auto 15px;
}
</style>
