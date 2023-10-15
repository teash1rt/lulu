import { createApp } from '../../../node_modules/vue/dist/vue.esm-browser.js'
import { invoke } from '../../../node_modules/@tauri-apps/api/tauri.js'

const app = createApp({
    data() {
        return {
            fileType: 'lulu'
        }
    },
    methods: {
        async confirm() {
            const res = await invoke('run_code', {
                code: 'console.log(1)'
            })
            console.log(res)
        },
        cancel() {}
    }
})

app.mount('#app')
