interface DragDropItemsProps {
    id: string
    visible: boolean
    text: string
    classes?: {
        checkbox: string
    }
    handleToggle: (id: string) => void
}

interface DragDropListProps {
    listItems: any[]
    handleUpdateListOrder: (list: any[]) => void
    handleToggle: (id: string) => void
}

export type { DragDropItemsProps, DragDropListProps}