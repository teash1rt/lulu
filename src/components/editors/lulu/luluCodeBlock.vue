<template>
    <div class="code-editor">
        <div class="tag">
            <svg-icon
                name="start"
                class="icon"
                @click="runCode"
                v-if="status !== 'isRunning'" />
            <svg-icon name="stop" class="icon" @click="runCode" v-else />
        </div>
        <div class="editor-box">
            <div class="editor" :ref="setEditor"></div>
            <div class="code-result" v-if="status === 'afterRunning'">
                <div class="info">
                    <svg-icon
                        name="pass"
                        class="icon"
                        color="#8fc778"
                        v-if="codeResult.status === 'success'" />
                    <svg-icon name="close" class="icon" color="#ff0000" v-else />
                    {{ codeResult.time }}s
                </div>
                <div class="message">{{ codeResult.message }}</div>
            </div>
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
    status: 'success',
    message: '',
    time: 0.0
})

monaco.editor.defineTheme('myCustomTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
        'editor.background': '#0a0a0a'
    }
})

const luluStore = LuluStore()
const setEditor = (el: HTMLElement) => {
    editor.value = monaco.editor.create(el, {
        value: props.luluInfo.content,
        language: 'typescript',
        theme: 'myCustomTheme',
        roundedSelection: false,
        cursorStyle: 'line',
        automaticLayout: true,
        glyphMargin: false,
        useTabStops: false,
        fontSize: 20,
        quickSuggestionsDelay: 100,
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        minimap: {
            enabled: false
        },
        scrollBeyondLastLine: false,
        lineNumbers: 'off',
        renderLineHighlight: 'none'
    }) as monaco.editor.IStandaloneCodeEditor

    toRaw(editor.value!).layout({
        height:
            editor.value!.getOption(monaco.editor.EditorOption.lineHeight) *
                editor.value!.getModel()!.getLineCount() +
            20,
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
        setTimeout(() => {
            luluStore.changeFocus(false, props.luluInfo.id)
        }, 200)
    })
    return editor
}

const status = ref<'beforeRunning' | 'isRunning' | 'afterRunning'>('beforeRunning')
const runCode = async () => {
    const code = toRaw(editor.value)?.getValue()
    status.value = 'isRunning'
    const res: CodeResult = await invoke('run_code', {
        code: code
    })
    Object.assign(codeResult, res)
    status.value = 'afterRunning'
}

const getContent = () => {
    return toRaw(editor.value)?.getValue()!
}

defineExpose({
    getContent
})

onBeforeUnmount(() => {
    toRaw(editor.value!).dispose()
})
</script>

<style lang="less" scoped>
.code-editor {
    width: 100%;
    display: flex;
    gap: 15px;
    color: var(--block-font-color);

    .tag {
        margin-top: 6px;
    }
    .editor-box {
        background-color: var(--block-background-color);
        display: flex;
        flex-direction: column;
        width: calc(100% - 35px);
        padding-top: 15px;
    }

    .code-result {
        .info {
            display: flex;
            gap: 10px;
        }
        .message {
            background-color: var(--code-background-color);
            padding: 10px 26px 0 26px;
            white-space: pre-wrap;
        }
    }
}

.icon {
    display: flex;
    width: 20px;
    height: 20px;
}
</style>
