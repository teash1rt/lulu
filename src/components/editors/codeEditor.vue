<template>
    <div class="code-editor">
        <div :ref="setEditor" class="editor"></div>
        <!-- <div v-html="c.value"></div> -->
    </div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { ref, watch, onBeforeUnmount, toRaw } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'

// import hljs from 'highlight.js'

// const c = hljs.highlight('javascript', 'console.log(1)')
// console.log(c);

const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)

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

let lastContent = ''

watch(
    () => props.path,
    async (newV, oldV) => {
        await saveFile(oldV)
        lastContent = props.content
        toRaw(editor.value!).setValue(lastContent)
        monaco.editor.setModelLanguage(toRaw(editor.value!).getModel()!, getExtension(newV))
        toRaw(editor.value!).setScrollTop(0)
    }
)

const setEditor = (el: HTMLElement) => {
    editor.value = monaco.editor.create(el, {
        value: props.content,
        language: getExtension(props.path),
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
        lineNumbers: 'off'
    }) as monaco.editor.IStandaloneCodeEditor
    return editor
}

const saveFile = async (path: string) => {
    const curContent = toRaw(editor.value)?.getValue()
    if (curContent !== lastContent) {
        await invoke('write_file', {
            dir: path,
            text: curContent
        })
    }
}

onBeforeUnmount(async () => {
    await saveFile(props.path)
    toRaw(editor.value!).dispose()
})

const extensionMap: { [key: string]: string } = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    rs: 'rust',
    md: 'markdown',
    sh: 'shell'
}

const getExtension = (path: string) => {
    const extension = path.split('.').at(-1)!
    return extension in extensionMap ? extensionMap[extension] : extension
}
</script>

<style lang="less" scoped>
.code-editor {
    width: 100%;
    display: flex;
    .editor {
        width: 100%;
        height: 100%;
    }
}
</style>
