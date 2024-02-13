interface OptionsProps {
    value: string
    label: string
}

interface MutlipleSelectProps {
    disabled: boolean
    options: OptionsProps[]
}

export type { MutlipleSelectProps }