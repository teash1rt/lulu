<template>
    <div class="kanban-view">
        <div class="column" v-for="i in 3" :key="i">
            <div class="header">
                {{ header[i - 1] }}
            </div>
            <VueDraggable
                class="tasks"
                v-model="list[i - 1]"
                :animation="150"
                ghostClass="ghost"
                group="people">
                <taskItem
                    v-for="item in list[i - 1]"
                    :key="item.id"
                    @removeItem="handleRemove(item.id)">
                    <template #task>
                        {{ item.name }}
                    </template>
                </taskItem>
            </VueDraggable>
            <hr class="divider" />
            <taskAddition @addTask="handleAddition(i - 1, $event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import taskItem from '../components/tasks/taskItem.vue'
import taskAddition from '../components/tasks/taskAddition.vue'
import { getUUID } from '../utils/uuid'

const header = ['To do', 'In progress', 'Completed']

const list = ref([
    [
        {
            name: 'Jan',
            id: '1'
        },
        {
            name: 'Jean',
            id: '2'
        },
        {
            name: 'Johanna',
            id: '3'
        },
        {
            name: 'Juan',
            id: '4'
        }
    ],
    [
        {
            name: 'tom',
            id: '5'
        },
        {
            name: 'mare',
            id: '6'
        }
    ],
    [
        {
            name: 'mage',
            id: '7'
        },
        {
            name: 'jack',
            id: '8'
        }
    ]
])

const handleRemove = (id: string) => {
    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j < list.value[i].length; j++) {
            if (list.value[i][j].id === id) {
                console.log('find')
                list.value[i].splice(j, 1)
                break
            }
        }
    }
}

const handleAddition = (index: number, content: string) => {
    list.value[index].push({
        name: content,
        id: getUUID(false)
    })
}
</script>

<style scoped lang="less">
.kanban-view {
    display: flex;
    justify-content: center;
    gap: 4%;
    background-color: #363636;
    height: 100%;
    min-width: 900px;

    .column {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 15px;
        width: 250px;
        background-color: #262626;
        border-radius: 5px;
        overflow: hidden;
        margin: 10px 0 auto 0;

        .header {
            color: var(--block-font-color);
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
