import { defineStore } from 'pinia'
import type { FofInfo } from '../types/FofInfo'

export const FileStore = defineStore('FileStore', {
    state: () => {
        return {
            isOpen: false,
            fofId: '',
            filePath: '',
            fofInfo: [] as FofInfo[],
            openPath: ''
        }
    }
})
