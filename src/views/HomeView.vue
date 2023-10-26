<template>
    <div class="home-view">
        <svg-icon name="logo" class="icon" color="#4c4e4f" />
        <div class="title">Welcome To Lulu</div>
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
    color: #4d4e4f;

    .title {
        margin-top: 10vh;
        margin-left: 25px;
        font-size: 2.5rem;
        font-weight: 900;
    }
}

.icon {
    width: 200px;
    height: 200px;
    margin-top: 15vh;
}
</style>
