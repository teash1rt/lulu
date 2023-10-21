<template>
    <div class="kanban-panel">
        <div class="add-kanban" @click="handleAdd">
            <svg-icon name="plus" color="#ccc" class="icon" />
            添加看板
        </div>
        <kanbanList />
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import kanbanList from './kanbanList.vue'
import { invoke } from '@tauri-apps/api/tauri'

const router = useRouter()

const handleAdd = async () => {
    router.push({ name: 'kanban' })
    await invoke('read_kanban_list')
}
</script>

<style lang="less" scoped>
.kanban-panel {
    .add-kanban {
        color: #ffffff;
        background-color: #850bff;
        border-radius: 3px;
        cursor: pointer;
        width: 60%;
        height: 35px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.icon {
    width: 25px;
    height: 25px;
}
</style>
