import { createRouter, createWebHistory } from 'vue-router'

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
