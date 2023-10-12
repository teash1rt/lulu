<template>
    <div class="lulu-editor">
        <div class="editor-navbar">
            <button @click="addEditor('md')">addMd</button>
            <button @click="addEditor('code')">addCode</button>
            <button @click="deleteEditor">deleteEditor</button>
        </div>
        <div class="workspace">
            <component
                v-for="(component, index) in components"
                :key="blocks[index].id"
                :is="component"
                :luluInfo="blocks[index]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import luluMdBlock from './lulu/luluMdBlock.vue'
import luluCodeBlock from './lulu/luluCodeBlock.vue'
import { LuluInfo } from '../../types/LuluInfo'
import { getUUID } from '../../utils/uuid'
import { LuluStore } from '../../stores/LuluStore'

const props = defineProps({
    content: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    }
})

const components = ref<Array<typeof luluMdBlock | typeof luluCodeBlock>>([])
const blocks: LuluInfo[] = JSON.parse(props.content).blocks

for (let block of blocks) {
    components.value.push(block.type === 'md' ? markRaw(luluMdBlock) : markRaw(luluCodeBlock))
}

const luluStore = LuluStore()
const addEditor = (type: 'md' | 'code') => {
    let index = blocks.length
    if (luluStore.focusId !== null) {
        for (let i = 0; i < blocks.length; i++) {
            if (luluStore.focusId === blocks[i].id) {
                index = i + 1
                break
            }
        }
    }
    blocks.splice(index, 0, {
        id: getUUID(false),
        type: type,
        content: ''
    } as LuluInfo)
    components.value.splice(index, 0, type === 'md' ? markRaw(luluMdBlock) : markRaw(luluCodeBlock))
    setTimeout(() => {
        luluStore.holdFocus()
    }, 200)
}

const deleteEditor = () => {
    if (luluStore.focusId !== null) {
        let index = -1
        if (luluStore.focusId !== null) {
            for (let i = 0; i < blocks.length; i++) {
                if (luluStore.focusId === blocks[i].id) {
                    index = i
                    break
                }
            }
        }
        if (~index) {
            blocks.splice(index, 1)
            components.value.splice(index, 1)
        }
    }
}
</script>

<style lang="less" scoped>
.lulu-editor {
    width: 100%;
    background-color: var(--code-background-color);
    overflow: auto;

    .editor-navbar {
        // position: fixed;
        display: block;
    }
    .workspace {
        width: 80%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}
</style>
