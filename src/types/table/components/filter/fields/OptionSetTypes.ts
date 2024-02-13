interface OptionSetProps {
    onCommitValue: (value: string) => void
    options: any[]
    value: string
    singleSelect: boolean
}

interface SingleSelectBoxesProps {
    options: { optionSet: { options: [{ label: string, value: string }] } }
    value: any
    id: string
    onChange: (value: any, id?: string) => void
}

interface SelectBoxesProps {
    singleSelect?: boolean
    options: { optionSet: { options: [{ value: string, label: string }] } }
    onChange: (value: any, id?: string, type?: string) => void
    value: any
    id: string
    orientation?: any
}

interface MultiSelectBoxesProps {
    options: { optionSet: { options: [{ label: string, value: string }] } }
    value: any
    id: string
    onChange: (value: any, id?: string, type?: string) => void
    valueType?: string
    orientation?: string
}


export type { OptionSetProps, SingleSelectBoxesProps, SelectBoxesProps, MultiSelectBoxesProps }