<template>
    <ul>
        <li v-for="item of props.fofInfo" :key="item.id">
            <div
                class="file-node"
                :style="fileNodeStyle(item.level)"
                :class="
                    fileStore.lastSelect !== null && fileStore.lastSelect.id === item.id
                        ? 'is-selected'
                        : ''
                "
                @click="handlePick(item)">
                <svg-icon
                    name="right"
                    class="icon"
                    v-if="item.is_dir && !fileStore.expandFolder.includes(item.id)" />
                <svg-icon
                    name="down"
                    class="icon"
                    v-else-if="item.is_dir && fileStore.expandFolder.includes(item.id)" />
                {{ item.name }}
            </div>
            <ul class="node-list" v-if="item.children && fileStore.expandFolder.includes(item.id)">
                <li>
                    <FileTree :fofInfo="item.children" />
                </li>
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { FileStore } from '../../../stores/FileStore.ts'
import type { FofInfo } from '../../../types/FofInfo.ts'
import { useRouter } from 'vue-router'
import { BusEvent } from '../../../types/BusEvent'
import { emit } from '@tauri-apps/api/event'

const props = defineProps({
    fofInfo: {
        type: Array<FofInfo>,
        required: true
    }
})

const fileNodeStyle = (level: number) => {
    return {
        paddingLeft: level * 15 + 'px'
    }
}

const router = useRouter()
const fileStore = FileStore()
const handlePick = async (item: FofInfo) => {
    fileStore.lastSelect = item

    if (item.is_dir) {
        let isExpand = false
        for (let i = 0; i < fileStore.expandFolder.length; i++) {
            if (fileStore.expandFolder[i] === item.id) {
                isExpand = true
                fileStore.expandFolder.splice(i, 1)
                break
            }
        }
        if (!isExpand) {
            fileStore.expandFolder.push(item.id)
        }
    } else if (fileStore.filePath !== item.file_path) {
        fileStore.filePath = item.file_path
        if (router.currentRoute.value.name !== 'file') {
            await router.push({ name: 'file' })
        }
        await emit(BusEvent.SwitchFilePath, item.file_path)
    }
}
</script>

<style lang="less" scoped>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    font-size: 1.1rem;
}

.node-list {
    line-height: 24px;
}

.file-node {
    line-height: 24px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
        background-color: var(--element-hover-color);
    }
}

.icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
}

.is-selected {
    background-color: var(--element-hover-color);
}
</style>
