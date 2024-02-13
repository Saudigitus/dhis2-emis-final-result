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

export type { RowCellProps }