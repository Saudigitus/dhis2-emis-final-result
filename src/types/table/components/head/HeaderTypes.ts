interface tableProps {
    head: any
    footer: any
}

interface HeaderCellProps {
    children?: React.ReactNode
    className?: string
    passOnProps?: object
    table?: tableProps
    colspan?: number
}

export type { HeaderCellProps }