<template>
    <div class="home-view">
        <svg-icon name="logo" class="icon" color="#4c4e4f" />
        <div class="title">Lulu</div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.home-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--common-background-color);
    height: 100%;
    color: var(--home-font-color);

    .title {
        margin-top: 3vh;
        font-size: 5rem;
        font-weight: 900;
    }
}

.icon {
    width: 320px;
    height: 320px;
    margin-top: 8vh;
}
</style>
