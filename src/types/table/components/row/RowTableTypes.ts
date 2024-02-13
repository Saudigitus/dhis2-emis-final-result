interface tableProps {
    head: any
    footer: any
}

interface RowTableProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: tableProps
}

export type { RowTableProps }