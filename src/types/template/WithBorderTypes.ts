type EnumType = "all" | "bottom" | "top"

interface WithBorderProps {
    type: EnumType
    children?: React.ReactNode
}

export type { WithBorderProps }