<template>
    <div class="lulu-editor">
        <div class="editor-navbar">
            <div class="display">
                <svg-icon
                    name="left"
                    class="icon"
                    color="#ccc"
                    @click="navbarVisible = false"
                    v-if="navbarVisible" />
                <svg-icon
                    name="right"
                    class="icon"
                    color="#ccc"
                    @click="navbarVisible = true"
                    v-if="!navbarVisible" />
            </div>
            <div class="options" v-if="navbarVisible">
                <div @click="addEditor('code')">+ Code</div>
                <div @click="addEditor('md')">+ Markdown</div>
                <div @click="deleteEditor">
                    <svg-icon name="delete" class="icon" color="#ccc" />
                </div>
            </div>
        </div>
        <div class="workspace">
            <component
                v-for="(component, index) in components"
                :key="blocks[index].id"
                :is="component"
                :luluInfo="blocks[index]"
                :ref="
                    ref =>
                        (luluRef[index] = ref as unknown as
                            | typeof luluMdBlock
                            | typeof luluCodeBlock)
                " />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, markRaw, watch, onBeforeUnmount } from 'vue'
import luluMdBlock from './lulu/luluMdBlock.vue'
import luluCodeBlock from './lulu/luluCodeBlock.vue'
import type { LuluInfo } from '../../types/LuluInfo'
import { getUUID } from '../../utils/uuid'
import { LuluStore } from '../../stores/LuluStore'
import { invoke } from '@tauri-apps/api/tauri'

const navbarVisible = ref<boolean>(true)

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

const luluRef = ref<Array<typeof luluMdBlock | typeof luluCodeBlock> | []>([])
const components = ref<Array<typeof luluMdBlock | typeof luluCodeBlock>>([])
const blocks = ref<LuluInfo[]>([])

const init = () => {
    luluRef.value = []
    components.value = []
    blocks.value = JSON.parse(props.content).blocks
    for (let block of blocks.value) {
        components.value.push(block.type === 'md' ? markRaw(luluMdBlock) : markRaw(luluCodeBlock))
    }
}

init()

const luluStore = LuluStore()
const addEditor = (type: 'md' | 'code') => {
    let index = blocks.value.length
    if (luluStore.focusId !== null) {
        for (let i = 0; i < blocks.value.length; i++) {
            if (luluStore.focusId === blocks.value[i].id) {
                index = i + 1
                break
            }
        }
    }
    blocks.value.splice(index, 0, {
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
        for (let i = 0; i < blocks.value.length; i++) {
            if (luluStore.focusId === blocks.value[i].id) {
                index = i
                break
            }
        }
        if (~index) {
            blocks.value.splice(index, 1)
            components.value.splice(index, 1)
        }
    }
}

const saveFile = async (path: string) => {
    const content = {
        blocks: [] as LuluInfo[]
    }
    for (let i = 0; i < blocks.value.length; i++) {
        const blockContent = luluRef.value[i].getContent()
        content.blocks.push({
            id: blocks.value[i].id,
            type: blocks.value[i].type,
            content: blockContent
        })
    }
    await invoke('write_file', {
        path: path,
        text: JSON.stringify(content)
    })
}

watch(
    () => props.path,
    async (_, oldV) => {
        await saveFile(oldV)
        init()
    }
)

onBeforeUnmount(async () => {
    await saveFile(props.path)
})
</script>

<style lang="less" scoped>
.lulu-editor {
    width: 100%;
    min-width: 750px;
    background-color: var(--code-background-color);
    overflow: auto;

    .editor-navbar {
        width: 100%;
        position: fixed;
        display: flex;
        gap: 20px;
        color: var(--block-font-color);
        padding: 10px;
        z-index: 100;
        background-color: var(--code-background-color);

        .options {
            display: flex;
        }

        .options div,
        .display {
            padding: 5px;
            margin: 0 5px;
            cursor: pointer;
            &:hover {
                background-color: #3d3e40;
            }
        }

        .display {
            padding-top: 3px;
        }
    }
    .workspace {
        width: 80%;
        margin: 60px auto 0;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}

.icon {
    width: 17px;
    height: 17px;
    vertical-align: middle;
}
</style>
