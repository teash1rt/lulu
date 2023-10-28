import { createRouter, createWebHistory } from 'vue-router'
import pinia from '../stores/store'
import { KanbanStore } from '../stores/KanbanStore'
import { FileStore } from '../stores/FileStore'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: {
            type: 'view'
        }
    },
    {
        path: '/file',
        name: 'file',
        component: () => import('../views/FileView.vue'),
        meta: {
            type: 'view'
        }
    },
    {
        path: '/kanban',
        name: 'kanban',
        component: () => import('../views/KanbanView.vue'),
        meta: {
            type: 'view'
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'),
        meta: {
            type: 'view'
        }
    },
    {
        path: '/$/new-file',
        name: 'newFile',
        component: () => import('../views/windows/NewFile.vue'),
        meta: {
            type: 'window'
        }
    },
    {
        path: '/$/new-folder',
        name: 'newFolder',
        component: () => import('../views/windows/NewFolder.vue'),
        meta: {
            type: 'window'
        }
    },
    {
        path: '/$/new-kanban',
        name: 'newKanban',
        component: () => import('../views/windows/NewKanban.vue'),
        meta: {
            type: 'window'
        }
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
