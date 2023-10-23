import { createApp } from '../../../node_modules/vue/dist/vue.esm-browser.js'
import { appWindow } from '../../../node_modules/@tauri-apps/api/window'
import { emit } from '../../../node_modules/@tauri-apps/api/event'

const app = createApp({
    data() {
        return {
            folderName: null
        }
    },
    methods: {
        confirm() {
            if (this.folderName !== null) {
                emit('createFolder', {
                    folderName: this.folderName
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
