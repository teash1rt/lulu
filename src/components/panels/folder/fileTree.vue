<template>
    <ul onselectstart="return false">
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
                    v-if="item.is_dir && !expandFolder.includes(item.id)" />
                <svg-icon
                    name="down"
                    class="icon"
                    v-else-if="item.is_dir && expandFolder.includes(item.id)" />
                <!-- <svg-icon
                    name="markdown"
                    class="icon"
                    v-else-if="item.extension === 'md'"
                    color="#ffffff" /> -->
                {{ item.name }}
            </div>
            <ul class="node-list" v-if="item.children && expandFolder.includes(item.id)">
                <li>
                    <FileTree :fofInfo="item.children" />
                </li>
            </ul>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const fileStore = FileStore()

// 保存目录树中展开的文件夹
const expandFolder = ref<string[]>([])

const fileNodeStyle = (level: number) => {
    return {
        paddingLeft: level * 15 + 'px'
    }
}

const router = useRouter()
const handlePick = async (item: FofInfo) => {
    fileStore.lastSelect = item

    if (item.is_dir) {
        let isExpand = false
        for (let i = 0; i < expandFolder.value.length; i++) {
            if (expandFolder.value[i] === item.id) {
                isExpand = true
                expandFolder.value.splice(i, 1)
                break
            }
        }
        if (!isExpand) {
            expandFolder.value.push(item.id)
        }
    } else if (fileStore.filePath !== item.file_path) {
        fileStore.filePath = item.file_path
        if (router.currentRoute.value.name !== 'file') {
            router.push({ name: 'file' })
        }
        emit(BusEvent.SwitchFilePath, item.file_path)
    }
}
</script>

<style lang="less" scoped>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.node-list {
    line-height: 24px;
    color: #ccc;
}
.file-node {
    line-height: 24px;
    color: #ccc;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
        background-color: #3d3e40;
    }
}

.icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
}

.is-selected {
    background-color: #3d3e40;
}
</style>
