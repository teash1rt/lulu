/**
 * @meaning kanban 的原始列数据
 */

export type KanbanColumn = {
    column_type: string
    content: string[]
}

/**
 * @meaning 已创建的 kanban 列表
 */

export type KanbanListItem = {
    id: string
    name: string
}

/**
 * @meaning 封装了uuid 后的 kanban 列数据
 */

export type KanbanColumnInfo = {
    column_type: string
    data: {
        id: string
        content: string
    }[]
}
