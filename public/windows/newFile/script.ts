import { createApp } from '../../../node_modules/vue/dist/vue.esm-browser.js'
import { appWindow } from '../../../node_modules/@tauri-apps/api/window'
import { emit } from '../../../node_modules/@tauri-apps/api/event'

const app = createApp({
    data() {
        return {
            fileName: null,
            fileType: 'lulu'
        }
    },
    methods: {
        confirm() {
            if (this.fileName !== null) {
                emit('createFile', {
                    fileName: this.fileName,
                    fileType: this.fileType
                })
            }
            this.closeWindow()
        },
        cancel() {
            this.closeWindow()
        },
        closeWindow() {
            appWindow.close()
        }
    }
})

app.mount('#app')
