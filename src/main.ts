import { createApp } from 'vue'
import App from './App.vue'
import pinia from './stores/store'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import 'virtual:svg-icons-register'
import svgIcon from './configs/svgIcon.vue'
import router from './configs/router'
import './styles/config.less'
import './styles/window.less'
import './styles/markdown.less'

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker()
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker()
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker()
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker()
        }
        return new editorWorker()
    }
}

document.addEventListener('contextmenu', event => {
    event.preventDefault()
})

const app = createApp(App)
app.use(pinia).use(router).component('svg-icon', svgIcon)
app.mount('#app')
