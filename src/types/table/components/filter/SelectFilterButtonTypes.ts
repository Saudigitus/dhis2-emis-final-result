interface ActiveFilterButtonProps {
    onChange: () => void
    iconClass: any
    title: string
    arrowIconElement: React.ReactElement
    buttonText: string
    onClear: () => void
    innerRef: (instance: HTMLDivElement | null) => void
}

interface RenderWithAppliedFilterProps {
    selectorVisible: boolean
    classes: any
    title: string
    disabled: boolean
    tooltipContent: string
    refActiveFilterInstance: (instance: HTMLDivElement | null) => void
    openFilterSelector: () => void
    onClose: () => void
    filled: string
}

interface RenderWithoutAppliedFilterProps {
    selectorVisible: boolean
    classes: any
    title: string
    disabled: boolean
    tooltipContent: string
    openFilterSelector: () => void
}

interface SelectButtonProps {
    colum: any
    value: any
    onChange: any
    filled: string
    onQuerySubmit: any
    disabled: any
    disabledReset: any
    onResetFilters: any
    title: string
    tooltipContent: string
}

export type { ActiveFilterButtonProps, RenderWithAppliedFilterProps, RenderWithoutAppliedFilterProps, SelectButtonProps}