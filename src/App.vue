<template>
    <div class="app">
        <div v-if="routeType === 'view'">
            <navBar data-tauri-drag-region class="nav-bar" />
            <div class="container">
                <div class="side-bar">
                    <sideBar />
                </div>
                <div class="content">
                    <RouterView />
                </div>
            </div>
        </div>
        <div v-else>
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import sideBar from './components/bars/sideBar.vue'
import navBar from './components/bars/navBar.vue'
import { onMounted, watch, ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { SettingsStore } from './stores/SettingsStore'
import type { Settings } from './types/Settings'
import { changeTheme } from './utils/changeTheme'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeType = ref<'window' | 'view'>('view')
watch(
    () => route.name,
    () => {
        routeType.value = route.meta.type as 'window' | 'view'
    }
)

const settingsStore = SettingsStore()
onMounted(async () => {
    settingsStore.settings = (await invoke('read_settings')) as Settings
    changeTheme(settingsStore.settings!.display.md_code_theme)
})
</script>

<style lang="less" scoped>
.app {
    .nav-bar {
        height: 40px;
        border-bottom: 1px solid var(--common-border-color);
    }

    .container {
        height: calc(100vh - 41px);
        flex: 1;
        display: flex;

        .content {
            flex: 1;
            overflow: auto;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
