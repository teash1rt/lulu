export const codeTheme = [
    'atom',
    'classic',
    'dracula',
    'github',
    'obsidian',
    'one dark',
    'panda syntax',
    'vs2015'
] as const

export type CodeTheme = (typeof codeTheme)[number]
