<template>
    <div class="kanban-list">
        <div
            class="list-item"
            :class="kanbanStore.kanbanId === e.id ? 'is-select' : ''"
            v-for="e in list"
            :key="e.id"
            @click="handlePick(e.id)">
            <div class="item-name">
                {{ e.name }}
            </div>
            <div class="remove-item" @click.stop="handleRemove(e.id)">-</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { KanbanListItem } from '../../../types/Kanban'
import { useRouter } from 'vue-router'
import { KanbanStore } from '../../../stores/KanbanStore'
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

const list = ref<KanbanListItem[]>([])
const getKanbanList = async () => {
    list.value = await invoke('get_kanban_list')
}
getKanbanList()

const router = useRouter()
const kanbanStore = KanbanStore()

const handlePick = (id: string) => {
    kanbanStore.kanbanId = id
    router.push({ name: 'kanban' })
}

listen('createKanban', async data => {
    await invoke('create_kanban', {
        name: (data.payload as { kanbanName: string }).kanbanName
    })
    await getKanbanList()
})

const handleRemove = async (id: string) => {
    await invoke('delete_kanban', { id })
    if (kanbanStore.kanbanId === id) {
        kanbanStore.kanbanId = ''
        await router.push({ name: 'home' })
    }
    await getKanbanList()
}
</script>

<style lang="less" scoped>
.kanban-list {
    .list-item {
        height: 60px;
        border-top: 1px solid var(--common-border-color);
        border-bottom: 1px solid var(--common-border-color);
        position: relative;

        &:hover {
            background-color: var(--element-hover-color);
        }

        .item-name {
            margin: 5px 0 0 15px;
        }

        .remove-item {
            position: absolute;
            bottom: 12px;
            right: 10px;
            font-size: 3rem;
            line-height: 0.2em;
            font-weight: 300;
            cursor: pointer;

            &:hover {
                font-size: 3.5rem;
                line-height: 0.1em;
            }
        }
    }
}

.is-select {
    background-color: var(--element-hover-color);
}
</style>
