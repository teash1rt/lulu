import { defineStore } from 'pinia'

export const KanbanStore = defineStore('KanbanStore', {
    state: () => {
        return {
            kanbanId: ''
        }
    }
})
