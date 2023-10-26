<template>
    <div class="kanban-view">
        <div class="column" v-for="(column, index) in columns" :key="column.column_type">
            <div class="type">
                {{ column.column_type }}
            </div>
            <VueDraggable
                class="tasks"
                v-model="column.data"
                :animation="150"
                ghostClass="ghost"
                group="people">
                <taskItem
                    v-for="item in column.data"
                    :key="item.id"
                    @removeItem="handleRemove(item.id)">
                    <template #task>
                        {{ item.content }}
                    </template>
                </taskItem>
            </VueDraggable>
            <hr class="divider" />
            <taskAddition @addTask="handleAddition(index, $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import taskItem from '../components/tasks/taskItem.vue'
import taskAddition from '../components/tasks/taskAddition.vue'
import { getUUID } from '../utils/uuid'
import type { KanbanColumn, KanbanColumnInfo } from '../types/Kanban'
import { invoke } from '@tauri-apps/api/tauri'
import { KanbanStore } from '../stores/KanbanStore'
import { emit, listen } from '@tauri-apps/api/event'
import { BusEvent } from '../types/BusEvent'

const columns = ref<KanbanColumnInfo[]>([])
const kanbanStore = KanbanStore()

// +id 封装
const getKanbanColumn = async () => {
    const list: KanbanColumn[] = await invoke('read_kanban', {
        id: kanbanStore.kanbanId
    })
    columns.value = []
    for (let item of list) {
        const data: { id: string; content: string }[] = []
        for (let content of item.content) {
            const id = getUUID()
            data.push({
                id,
                content
            })
        }
        columns.value.push({
            column_type: item.column_type,
            data
        })
    }
}
getKanbanColumn()

// -id 解封
const getRawKanbanList = () => {
    const list: KanbanColumn[] = [
        {
            column_type: 'To do',
            content: []
        },
        {
            column_type: 'In progress',
            content: []
        },
        {
            column_type: 'Completed',
            content: []
        }
    ]
    for (let i = 0; i < columns.value.length; i++) {
        for (let item of columns.value[i].data) {
            list[i].content.push(item.content)
        }
    }
    return list
}

const handleRemove = (id: string) => {
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j < columns.value[i].data.length; j++) {
            if (columns.value[i].data[j].id === id) {
                columns.value[i].data.splice(j, 1)
                break
            }
        }
    }
}

const handleAddition = (index: number, content: string) => {
    columns.value[index].data.push({
        id: getUUID(),
        content
    })
}

const saveFile = async (path: string) => {
    await invoke('save_kanban', {
        id: path,
        columns: getRawKanbanList()
    })
}

watch(
    () => kanbanStore.kanbanId,
    async (_, oldV) => {
        await saveFile(oldV)
        getKanbanColumn()
    }
)

listen(BusEvent.SaveFile, async () => {
    await saveFile(kanbanStore.kanbanId)
    emit(BusEvent.SaveCompleted)
})

onBeforeUnmount(async () => {
    await saveFile(kanbanStore.kanbanId)
})
</script>

<style scoped lang="less">
.kanban-view {
    display: flex;
    justify-content: center;
    gap: 4%;
    background-color: var(--common-background-color);
    height: 100%;
    min-width: 900px;

    .column {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 15px;
        width: 250px;
        background-color: var(--bar-background-color);
        border-radius: 5px;
        overflow: hidden;
        margin: 10px 0 auto 0;

        .type {
            padding: 0 7px;
            font-weight: 600;
            font-size: 1.1rem;
            display: flex;
            justify-content: space-between;
        }

        .tasks {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
    }

    .divider {
        border-color: #000000;
    }
}
</style>
