<template>
    <div class="file-view">
        <component :is="component" :content="content" :path="path" ref="fileRef" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, markRaw, onMounted } from 'vue'
import type { Component } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import mdEditor from '../components/editors/mdEditor.vue'
import luluEditor from '../components/editors/luluEditor.vue'
import { BusEvent } from '../types/BusEvent'
import { FileStore } from '../stores/FileStore.ts'
import { emit, listen } from '@tauri-apps/api/event'

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

const component = ref<Component | null>(null)

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

const fileRef = ref<InstanceType<typeof mdEditor> | InstanceType<typeof luluEditor> | null>(null)

listen(BusEvent.SaveFile, async () => {
    await fileRef.value!.saveFile()
    await emit(BusEvent.SaveCompleted)
})
</script>

<style lang="less" scoped>
.file-view {
    height: 100%;
    display: flex;
}
</style>
