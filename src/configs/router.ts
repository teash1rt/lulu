import { createRouter, createWebHistory } from 'vue-router'
import pinia from '../stores/store'
import { KanbanStore } from '../stores/KanbanStore'
import { FileStore } from '../stores/FileStore'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/file',
        name: 'file',
        component: () => import('../views/FileView.vue')
    },
    {
        path: '/kanban',
        name: 'kanban',
        component: () => import('../views/KanbanView.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const kanbanStore = KanbanStore(pinia)
const fileStore = FileStore(pinia)
router.beforeEach(to => {
    if (to.name === 'kanban') {
        fileStore.lastSelect = null
        fileStore.filePath = ''
    } else if (to.name === 'file') {
        kanbanStore.kanbanId = ''
    } else {
        fileStore.lastSelect = null
        fileStore.filePath = ''
        kanbanStore.kanbanId = ''
    }
})

export default router
