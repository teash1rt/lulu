<template>
    <div class="side-bar">
        <div class="bar">
            <svg-icon name="folder" class="icon" @click="handlePick(markRaw(folderPanel))" />
            <svg-icon name="kanban" class="icon" />
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

const expandComponent = ref<Raw<typeof folderPanel> | null>(null)

const handlePick = (component: Raw<typeof folderPanel>) => {
    expandComponent.value = expandComponent.value ? null : component
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

        .icon {
            margin: 0 auto;
            width: 30px;
            height: 30px;
            cursor: pointer;
        }
    }

    .panel {
        width: 320px;
        height: 100%;
        overflow: auto;
    }
}
</style>
