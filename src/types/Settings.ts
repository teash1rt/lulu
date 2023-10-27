import type { CodeTheme } from './CodeTheme'

export type Settings = {
    common: {
        auto_save: boolean
        open_in_browser: boolean
    }
    display: {
        md_mode: 'edit' | 'preview'
        md_code_theme: CodeTheme
    }
}
