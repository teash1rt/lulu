<template>
    <div class="task-addition">
        <div class="status-icon" v-if="status === 'icon'" @click="status = 'input'">
            <svg-icon name="plus" class="icon" color="#ccc" />
        </div>
        <div class="status-input" v-else>
            <input v-model="content" @blur="handleAddition" @keydown.enter="handleAddition" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const status = ref<'icon' | 'input'>('icon')
const content = ref<string>('')
const emit = defineEmits(['addTask'])
const handleAddition = () => {
    if (status.value === 'input') {
        status.value = 'icon'
        emit('addTask', content.value)
    }
}
</script>

<style lang="less" scoped>
.status-icon,
.status-input {
    height: 35px;
    border-radius: 10px;
}
.status-icon {
    border: 1px solid #393939;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: #850bff;
    }
}

.status-input {
    display: flex;
    border: 1px solid #850bff;

    input {
        height: 90%;
        width: 90%;
        background-color: #262626;
        border: none;
        margin: auto;
        color: var(--block-font-color);
        &:focus {
            outline: none;
        }
    }
}
.icon {
    width: 20px;
    height: 20px;
}
</style>
