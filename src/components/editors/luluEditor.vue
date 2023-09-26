<template>
    <div class="lulu-editor">
        <button @click="addEditor('md')">addMd</button>
        <button @click="addEditor('code')">addCode</button>
        <div class="workspace">
            <component
                v-for="(component, index) in components"
                :key="index"
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

const addEditor = (editor: 'md' | 'code') => {
    components.value.push(editor === 'md' ? markRaw(luluMdBlock) : markRaw(luluCodeBlock))
}
</script>

<style lang="less" scoped>
.lulu-editor {
    width: 100%;
    background-color: var(--code-background-color);

    .workspace {
        width: 80%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}
</style>
