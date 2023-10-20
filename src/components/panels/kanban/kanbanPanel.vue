<template>
    <div class="kanban-panel">
        <div class="add-kanban" @click="handleAdd">
            <svg-icon name="plus" color="#ccc" class="icon" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleAdd = () => {
    router.push({ name: 'kanban' })
}
</script>

<style lang="less" scoped>
.kanban-panel {
    .add-kanban {
        color: #ffffff;
        background-color: #e86a3d;
        border-radius: 3px;
        cursor: pointer;
        width: 60%;
        height: 45px;
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
