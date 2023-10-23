import { defineStore } from 'pinia'
import type { FofInfo } from '../types/FofInfo'

export const FileStore = defineStore('FileStore', {
    state: () => {
        return {
            isOpen: false,
            filePath: '',
            fofInfo: [] as FofInfo[],
            openPath: '',
            lastSelect: null as null | FofInfo,
            expandFolder: [] as string[]
        }
    }
})
