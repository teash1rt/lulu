import { defineStore } from 'pinia'

export const LuluStore = defineStore('LuluStore', {
    state: () => {
        return {
            focusId: null as null | string
        }
    },
    actions: {
        changeFocus(isFocus: boolean, id: string) {
            if (isFocus) {
                this.focusId = id
            } else if (id === this.focusId) {
                // 离开编辑器块A可能发生在聚焦编辑器B后
                this.focusId = null
            }
        }
    }
})
