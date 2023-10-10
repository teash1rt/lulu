<template>
    <div class="md-editor">
        <textarea
            v-if="status === 'md'"
            @blur="handleBlur"
            @focus="handleFocus"
            v-model="content"
            :rows="content.split('\n').length"
            ref="textarea"
            @keydown.enter.prevent="handleEnter($event)"
            @keydown.tab.prevent="handleTab($event)"
            @keydown.`.prevent="handleBlockquote($event)" />
        <div v-else v-html="html" @dblclick="handleFocus" />
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, PropType } from 'vue'
import { render } from '../../../utils/mdRender.ts'
import {
    getLineScope,
    getLineContext,
    getTabContext,
    getBlockquoteContext
} from '../../../utils/mdContext'
import type { LuluInfo } from '../../../types/LuluInfo'
import 'highlight.js/styles/monokai-sublime.css'
import '../../../styles/markdown.less'
import { LuluStore } from '../../../stores/LuluStore'

const props = defineProps({
    luluInfo: {
        type: Object as PropType<LuluInfo>,
        required: true
    }
})

const content = ref<string>(props.luluInfo.content)
const html = ref<string>(render(content.value).html)
const status = ref<'md' | 'html'>('md')
const luluStore = LuluStore()
const handleBlur = () => {
    setTimeout(() => {
        luluStore.changeFocus(false, props.luluInfo.id)
    }, 200)
    if (content.value.trim()) {
        html.value = render(content.value).html
        status.value = 'html'
    }
}

const textarea = ref<HTMLTextAreaElement | null>(null)
const handleFocus = () => {
    luluStore.changeFocus(true, props.luluInfo.id)
    status.value = 'md'
    nextTick(() => {
        textarea.value!.focus()
    })
}

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
</script>

<style lang="less" scoped>
.md-editor {
    margin-left: 51px;

    textarea {
        width: 100%;
        font-size: 20px;
        background-color: var(--block-background-color);
        color: var(--block-font-color);
    }

    div {
        cursor: pointer;
        padding: 5px 10px;
        width: 100%;
        color: var(--block-font-color);

        &:hover {
            box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);
        }
    }
}
</style>
