import { defineStore } from 'pinia'

export const LuluStore = defineStore('LuluStore', {
    state: () => {
        return {
            focusId: null as null | string,
            lastFocusId: null as null | string
        }
    },
    actions: {
        changeFocus(isFocus: boolean, id: string) {
            if (isFocus) {
                this.focusId = id
                this.lastFocusId = id
            } else if (id === this.focusId) {
                this.focusId = null
            }
        },
        holdFocus() {
            if (this.focusId === null) {
                this.focusId = this.lastFocusId
            }
        }
    }
})
