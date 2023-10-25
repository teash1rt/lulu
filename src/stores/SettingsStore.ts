import { defineStore } from 'pinia'
import type { Settings } from '../types/Settings'

export const SettingsStore = defineStore('SettingsStore', {
    state: () => {
        return {
            settings: null as null | Settings
        }
    }
})
