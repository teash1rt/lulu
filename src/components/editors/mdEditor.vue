<template>
    <div class="md-editor">
        <div class="options">
            <svg-icon name="text" class="icon" @click="mode = 'text'" />
            <svg-icon name="split" class="icon" @click="mode = 'split'" />
            <svg-icon name="preview" class="icon" @click="mode = 'preview'" />
        </div>
        <textarea
            v-if="mode === 'text'"
            v-model="content"
            :rows="content.split('\n').length"
            ref="textarea"
            @keydown.enter.prevent="handleEnter($event)"
            @keydown.tab.prevent="handleTab($event)"
            @keydown.`.prevent="handleBlockquote($event)" />
        <div v-else-if="mode === 'preview'" class="render" v-html="render(content).html" />
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onBeforeUnmount } from 'vue'
import {
    getLineScope,
    getLineContext,
    getTabContext,
    getBlockquoteContext
} from '../../utils/mdContext'
import 'highlight.js/styles/monokai-sublime.css'
import '../../styles/markdown.less'
import { invoke } from '@tauri-apps/api/tauri'
import { render } from '../../utils/mdRender'
import 'highlight.js/styles/monokai-sublime.css'

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

const mode = ref<'text' | 'split' | 'preview'>('text')
const content = ref<string>(props.content)
const textarea = ref<HTMLTextAreaElement | null>(null)

let lastContent = ''
watch(
    () => props.path,
    async (_, oldV) => {
        // await saveFile(oldV)
        content.value = props.content
        lastContent = props.content
    }
)

let lastLine: string | null = null
const handleEnter = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement
    const pos = target.selectionStart!
    let { l, r } = getLineScope(content.value, pos)
    const curLine = content.value.slice(l, r)
    const context = getLineContext(curLine, pos - l)
    content.value = content.value.slice(0, l) + context + content.value.slice(r)
    const bias = context.split('\n')[1].length
    lastLine = content.value.slice(l, pos)
    nextTick(() => {
        target.selectionEnd = pos + bias + 1
    })
}

const handleTab = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement
    const pos = target.selectionStart!
    let { l, r } = getLineScope(content.value, pos)
    const curLine = content.value.slice(l, r)
    const context = lastLine === null ? null : getTabContext(lastLine, curLine)
    if (context === null || context === curLine) {
        content.value = content.value.slice(0, pos) + ' '.repeat(4) + content.value.slice(pos)
    } else {
        content.value = content.value.slice(0, l) + context + content.value.slice(r)
    }
}

const handleBlockquote = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement
    const pos = target.selectionStart!
    let { l, r } = getLineScope(content.value, pos)
    const curLine = content.value.slice(l, r)
    const context = getBlockquoteContext(curLine)
    content.value = content.value.slice(0, l) + context + content.value.slice(r)
    nextTick(() => {
        target.selectionEnd = pos + 1
    })
}

const saveFile = async (path: string) => {
    if (content.value !== lastContent) {
        await invoke('write_file', {
            dir: path,
            text: content.value
        })
    }
}

onBeforeUnmount(async () => {
    // await saveFile(props.path)
})
</script>

<style lang="less" scoped>
.md-editor {
    width: 100%;
    height: 100%;
    background-color: var(--code-background-color);
    color: var(--block-font-color);
    position: relative;
    .options {
        position: absolute;
        left: 3px;
        top: 3px;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    textarea,
    .render {
        padding-left: 80px;
        padding-top: 30px;
        width: calc(100% - 80px);
        height: calc(100% - 30px);
        font-size: 20px;
        background-color: var(--code-background-color);
        color: var(--block-font-color);
    }

    textarea {
        display: flex;
    }
    .render {
        overflow: auto;
    }
}

.icon {
    width: 20px;
    height: 20px;
}
</style>
