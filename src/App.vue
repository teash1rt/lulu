<template>
    <div class="app">
        <navBar data-tauri-drag-region class="nav-bar" />
        <div class="container">
            <div class="side-bar">
                <sideBar />
            </div>
            <div class="content">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import sideBar from './components/bars/sideBar.vue'
import navBar from './components/bars/navBar.vue'
</script>

<style lang="less" scoped>
.app {
    width: 100%;
    .nav-bar {
        height: 40px;
    }

    .container {
        height: calc(100vh - 40px);
        flex: 1;
        display: flex;

        .content {
            flex: 1;
            overflow: auto;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
