<template>
    <div class="file-view">
        <component :is="component" :content="content" :path="path" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, markRaw, onMounted } from 'vue'
import type { Raw } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import codeEditor from '../components/editors/codeEditor.vue'
import mdEditor from '../components/editors/mdEditor.vue'
import luluEditor from '../components/editors/luluEditor.vue'
import { BusEvent } from '../types/BusEvent'
import { FileStore } from '../stores/FileStore.ts'
import { listen } from '@tauri-apps/api/event'

const content = ref<string>('')
const path = ref<string>('')

const extension = computed(() => {
    return path.value.split('.').at(-1)
})

const readFile = async (pathValue: string) => {
    return await invoke('read_file', {
        path: pathValue
    })
}

const component = ref<Raw<typeof mdEditor | typeof luluEditor | typeof codeEditor> | null>(null)

watch(extension, newV => {
    newV === 'md' ? (component.value = markRaw(mdEditor)) : (component.value = markRaw(luluEditor))
})

const fileStore = FileStore()

onMounted(async () => {
    content.value = (await readFile(fileStore.filePath)) as string
    path.value = fileStore.filePath
})

listen(BusEvent.SwitchFilePath, async data => {
    const newPath = data.payload as string
    content.value = (await readFile(newPath)) as string
    path.value = newPath
})
</script>

<style lang="less" scoped>
.file-view {
    height: 100%;
    display: flex;
}
</style>
