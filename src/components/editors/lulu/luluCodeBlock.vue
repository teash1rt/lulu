<template>
    <div class="code-editor">
        <svg-icon name="start" class="icon" @click="runCode" />
        <div class="editor-box">
            <div class="editor" :ref="setEditor"></div>
            <div v-if="codeResult.message">{{ codeResult.message }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { ref, toRaw, onBeforeUnmount, reactive, PropType } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import type { CodeResult } from '../../../types/CodeResult'
import type { LuluInfo } from '../../../types/LuluInfo'
import { LuluStore } from '../../../stores/LuluStore'

const props = defineProps({
    luluInfo: {
        type: Object as PropType<LuluInfo>,
        required: true
    }
})

const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)

const codeResult = reactive<CodeResult>({
    status: null,
    message: null
})

const luluStore = LuluStore()
const setEditor = (el: HTMLElement) => {
    editor.value = monaco.editor.create(el, {
        value: props.luluInfo.content,
        language: 'typescript',
        theme: 'vs-dark',
        roundedSelection: false,
        cursorStyle: 'line',
        automaticLayout: true,
        glyphMargin: false,
        useTabStops: false,
        fontSize: 20,
        quickSuggestionsDelay: 100,
        overviewRulerBorder: false,
        minimap: {
            enabled: false
        },
        scrollBeyondLastLine: false,
        lineNumbers: 'off'
    }) as monaco.editor.IStandaloneCodeEditor

    toRaw(editor.value!).layout({
        height: monaco.editor.EditorOption.lineHeight,
        width: editor.value.getLayoutInfo().width
    })

    editor.value.onDidChangeModelContent(() => {
        const lineCount = editor.value!.getModel()!.getLineCount()
        const lineHeight = editor.value!.getOption(monaco.editor.EditorOption.lineHeight)
        const newHeight = lineCount * lineHeight
        toRaw(editor.value!).layout({
            height: newHeight + 20,
            width: editor.value!.getLayoutInfo().width
        })
    })

    editor.value.onDidFocusEditorText(() => {
        luluStore.changeFocus(true, props.luluInfo.id)
    })

    editor.value.onDidBlurEditorText(() => {
        luluStore.changeFocus(false, props.luluInfo.id)
    })
    return editor
}

const runCode = async () => {
    const code = toRaw(editor.value)?.getValue()
    const res: CodeResult = await invoke('run_code', {
        code: code
    })
    codeResult.message = res.message
}

onBeforeUnmount(() => {
    toRaw(editor.value!).dispose()
})
</script>

<style lang="less" scoped>
.code-editor {
    width: 100%;
    display: flex;
    gap: 15px;
    border: 1px solid rgb(174, 174, 174);
    background-color: var(--block-background-color);
    color: var(--block-font-color);
    .editor-box {
        display: flex;
        flex-direction: column;
        width: 100%;

        .editor {
            margin: 14px 0;
        }
    }
}

.icon {
    width: 20px;
    height: 20px;
}
</style>
