<template>
    <div class="file-view">
        <keep-alive>
            <component :is="component" :content="content" :path="path" />
        </keep-alive>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, markRaw, getCurrentInstance } from 'vue'
import type { Raw } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import codeEditor from '../components/editors/codeEditor.vue'
import mdEditor from '../components/editors/mdEditor.vue'
import luluEditor from '../components/editors/luluEditor.vue'
import { BusEvent, SwitchFilePath } from '../types/BusEvent'

const content = ref<string>('')
const path = ref<string>('')

const extension = computed(() => {
    return path.value.split('.').at(-1)
})

const readFile = async (dir: string) => {
    return await invoke('read_file', {
        dir: dir
    })
}

const component = ref<Raw<typeof mdEditor | typeof luluEditor | typeof codeEditor> | null>(null)

watch(extension, newV => {
    switch (newV) {
        case 'md':
            component.value = markRaw(mdEditor)
            break
        case 'lulu':
            component.value = markRaw(luluEditor)
            break
        default:
            component.value = markRaw(codeEditor)
    }
})

const bus = getCurrentInstance()!.appContext.config.globalProperties.$bus

bus.on(BusEvent.SwitchFilePath, async (pathInfo: SwitchFilePath) => {
    content.value = (await readFile(pathInfo.newPath)) as string
    path.value = pathInfo.newPath
})
</script>

<style lang="less" scoped>
.file-view {
    height: 100%;
    display: flex;
}
</style>
