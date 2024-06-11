import { CustomAttributeProps } from "../variables/AttributeColumns"

interface TableProps {
    head: any
    footer: any
}

interface TableComponentProps {
    children?: React.ReactNode
    className?: string
}

interface HeaderCellProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: TableProps
    colspan?: number
    onClick?: () => void
}

interface RowProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: TableProps
}

interface RenderHeaderProps {
    hideCheckBox?:boolean
    rowsHeader?: CustomAttributeProps[]
    orderBy?: string
    order?: "asc" | "desc"
    // TODO resolve this bug.👇
    createSortHandler?: (property: string) => any
    rowsData?: any[]
    headerData?: CustomAttributeProps[]
}

interface TableSortProps {
    children?: React.ReactNode
    active: boolean
    direction?: 'asc' | 'desc'
    createSortHandler: (rowsPerPage: string) => void
}


type TableDataProps = Record<string, string>;

interface RenderRowsProps {
    hideCheckBox?:boolean
    rowsData: any[]
    loading?: boolean, 
    headerData: CustomAttributeProps[]
}

type tableProps = {
    head: any,
    footer: any,
}

type RowCellProps = {
    children?: React.ReactNode,
    className?: string,
    passOnProps?: object,
    table?: tableProps,
    colspan?: number,
}

interface RowTableProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: tableProps
}

export type { TableComponentProps, HeaderCellProps, RowProps, RenderHeaderProps, TableSortProps, TableDataProps, RenderRowsProps, RowCellProps, RowTableProps }