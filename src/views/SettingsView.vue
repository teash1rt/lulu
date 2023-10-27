<template>
    <div class="settings-view">
        <div class="settings-space">
            <h1>设置</h1>
            <h2>通用</h2>
            <hr />
            <div class="common-group">
                <div class="option">
                    <div class="attribute">自动保存</div>
                    <input type="checkbox" v-model="settings.common.auto_save" />
                </div>
                <div class="option">
                    <div class="attribute">使用默认浏览器打开链接</div>
                    <input type="checkbox" v-model="settings.common.open_in_browser" />
                </div>
            </div>
            <h2>显示</h2>
            <hr />
            <div class="common-group">
                <div class="option">
                    <div class="attribute">markdown默认模式</div>
                    <select v-model="settings.display.md_mode">
                        <option value="edit">编辑模式</option>
                        <option value="preview">预览模式</option>
                    </select>
                </div>
                <div class="option">
                    <div class="attribute">markdown代码块主题</div>
                    <select v-model="settings.display.md_code_theme">
                        <option v-for="theme in codeTheme" :key="theme" :value="theme">
                            {{ theme }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch, onBeforeUnmount } from 'vue'
import type { Settings } from '../types/Settings'
import { SettingsStore } from '../stores/SettingsStore'
import { changeTheme } from '../utils/changeTheme'
import { codeTheme } from '../types/CodeTheme'
import { invoke } from '@tauri-apps/api/tauri'
import { BusEvent } from '../types/BusEvent'
import { emit, listen } from '@tauri-apps/api/event'

const settingsStore = SettingsStore()
const settings = reactive<Settings>({ ...settingsStore.settings! })

const lastTheme = settings.display.md_code_theme

watch(settings, newV => {
    settingsStore.settings = { ...newV }
    if (settings.display.md_code_theme !== lastTheme) {
        changeTheme(settings.display.md_code_theme)
    }
})

const saveFile = async () => {
    await invoke('save_settings', {
        settings: settings
    })
}

listen(BusEvent.SaveFile, async () => {
    await saveFile()
    await emit(BusEvent.SaveCompleted)
})

onBeforeUnmount(async () => {
    await saveFile()
})
</script>

<style lang="less" scoped>
.settings-view {
    display: flex;
    background-color: var(--common-background-color);
    height: 100%;
    min-width: 900px;

    .settings-space {
        width: 60%;
        margin: 20px auto 0;

        h2 {
            margin-top: 30px;
        }

        hr {
            margin: 5px 0 30px 0;
        }

        .common-group {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    }

    .option {
        display: flex;
        justify-content: space-between;
    }
}
</style>
