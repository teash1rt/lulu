<template>
    <div class="md-editor">
        <div class="options">
            <svg-icon
                name="text"
                class="icon"
                :class="mode === 'edit' ? 'is-select' : ''"
                @click="mode = 'edit'" />
            <svg-icon
                name="split"
                class="icon"
                :class="mode === 'split' ? 'is-select' : ''"
                @click="mode = 'split'" />
            <svg-icon
                name="preview"
                class="icon"
                :class="mode === 'preview' ? 'is-select' : ''"
                @click="mode = 'preview'" />
        </div>
        <textarea
            v-if="mode === 'edit'"
            v-model="content"
            :rows="content.split('\n').length"
            @keydown.enter.prevent="handleEnter($event)"
            @keydown.tab.prevent="handleTab($event)" />
        <div
            v-else-if="mode === 'preview'"
            class="render markdown"
            v-html="render(content).html"
            @dblclick="mode = 'edit'"
            ref="renderRef" />
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onBeforeUnmount, onMounted } from 'vue'
import { getLineScope, getLineContext, getTabContext } from '../../utils/mdContext'
import '../../styles/markdown.less'
import { invoke } from '@tauri-apps/api/tauri'
import { render } from '../../utils/mdRender'
import { SettingsStore } from '../../stores/SettingsStore'
import { openUrl } from '../../utils/openUrl'

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

const settingStore = SettingsStore()
const mode = ref<'edit' | 'split' | 'preview'>(settingStore.settings!.display.md_mode)
const content = ref<string>(props.content)

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
        nextTick(() => {
            target.selectionEnd = pos + 4
        })
    } else {
        content.value = content.value.slice(0, l) + context + content.value.slice(r)
        nextTick(() => {
            target.selectionEnd = pos + 2
        })
    }
}

const renderRef = ref<HTMLDivElement | null>(null)

const handleClickLink = (anchors: NodeListOf<HTMLAnchorElement>) => {
    for (let anchor of anchors) {
        anchor.addEventListener('click', event => {
            event.preventDefault()
            openUrl(anchor.getAttribute('href'))
        })
    }
}

onMounted(() => {
    watch(
        mode,
        newV => {
            if (newV === 'preview') {
                nextTick(() => {
                    const anchors = renderRef.value!.querySelectorAll('a')
                    handleClickLink(anchors)
                })
            }
        },
        {
            immediate: true
        }
    )
})

let lastContent = ''
const saveFile = async (path: string = props.path) => {
    if (content.value !== lastContent && settingStore.settings!.common.auto_save) {
        await invoke('write_file', {
            path: path,
            text: content.value
        })
    }
}

watch(
    () => props.path,
    async (_, oldV) => {
        await saveFile(oldV)
        content.value = props.content
        lastContent = props.content
        mode.value = settingStore.settings!.display.md_mode
        if (mode.value === 'preview') {
            nextTick(() => {
                const anchors = renderRef.value!.querySelectorAll('a')
                handleClickLink(anchors)
            })
        }
    }
)

onBeforeUnmount(async () => {
    await saveFile(props.path)
})

defineExpose({
    saveFile
})
</script>

<style lang="less" scoped>
.md-editor {
    width: 100%;
    height: 100%;
    position: relative;
    .options {
        position: absolute;
        right: 25px;
        top: 5px;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    textarea,
    .render {
        padding: 30px 40px 0 60px;
        width: calc(100% - 100px);
        height: calc(100% - 30px);
        font-size: 1.3rem;
        background-color: var(--code-background-color);
    }

    textarea {
        display: flex;
    }
    .render {
        overflow-y: auto;
        word-wrap: break-word;
    }
}

.icon {
    width: 20px;
    height: 20px;
}

.is-select {
    background-color: var(--element-hover-color);
}
</style>
