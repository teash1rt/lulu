export type KanbanColumn = {
    column_type: string
    content: string[]
}

export type KanbanListItem = {
    id: string
    name: string
}

export type KanbanColumnInfo = {
    column_type: string
    data: {
        id: string
        content: string
    }[]
}
