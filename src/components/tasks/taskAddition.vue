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
        if (content.value.trim().length) {
            emit('addTask', content.value)
            content.value = ''
        }
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
    border: 1px solid var(--common-border-color);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: var(--theme-color);
    }
}

.status-input {
    display: flex;
    border: 1px solid var(--theme-color);

    input {
        height: 90%;
        width: 90%;
        background-color: var(--bar-background-color);
        border: none;
        margin: auto;
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
