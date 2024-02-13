import type { CustomAttributeProps } from "../AttributeColumns"

interface RenderHeaderProps {
    rowsHeader: CustomAttributeProps[]
    orderBy: string
    order: "asc" | "desc"
    createSortHandler: (property: string) => any
}

export type { RenderHeaderProps }