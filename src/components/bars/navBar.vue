<template>
    <div class="nav-bar">
        <div class="option-group">
            <div>Lu</div>
        </div>
        <div class="button-group">
            <div @click="minimizeWindow">
                <svg-icon name="minimize" class="icon" />
            </div>
            <div @click="maximizeWindow">
                <svg-icon name="maximize" class="icon" />
            </div>
            <div @click="closeWindow">
                <svg-icon name="close" class="icon" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'

const minimizeWindow = () => {
    appWindow.minimize()
}

const maximizeWindow = () => {
    appWindow.toggleMaximize()
}

const closeWindow = () => {
    appWindow.close()
}
</script>

<style lang="less" scoped>
.nav-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    background-color: #262626;
    color: #b6b6b6;

    .option-group {
        display: flex;
        cursor: default;

        div {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 0 10px;
            &:hover {
                background: #414240;
            }
        }
    }
    .button-group {
        display: flex;

        div {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 46px;
            &:hover {
                background: #414240;
            }

            .icon {
                width: 20px;
                height: 20px;
            }
        }

        div:nth-child(3) {
            &:hover {
                background: #d61425;
            }
        }
    }
}
</style>
