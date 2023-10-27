import { open } from '@tauri-apps/api/shell'
import pinia from '../stores/store'
import { SettingsStore } from '../stores/SettingsStore'

const settingsStore = SettingsStore(pinia)

export const openUrl = async (url: string | null) => {
    if (url !== null) {
        settingsStore.settings!.common.open_in_browser ? await open(url) : window.open(url)
    }
}
