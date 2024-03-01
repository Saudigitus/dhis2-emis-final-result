interface PaginationProps {
    page: number
    rowsPerPage: number
    onPageChange: (page: number) => void
    onRowsPerPageChange: (rowsPerPage: number) => void
    loading: boolean
    totalPerPage: number
}

interface IconButtonPaginationProps {
    onPageChange: (page: number) => void
    ariaLabel: string
    disabled: boolean
    icon: React.ReactNode
}

interface TextPaginationProps {
    text: string
}

export type { PaginationProps, IconButtonPaginationProps, TextPaginationProps }