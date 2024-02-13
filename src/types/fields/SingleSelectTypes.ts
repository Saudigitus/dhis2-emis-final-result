import { type CustomAttributeProps } from "../table/AttributeColumns";

interface AutoCompleteProps {
    name: string
    disabled?: boolean
    options?: CustomAttributeProps["options"]
    required: CustomAttributeProps["required"]
}

interface OptionsProps {
    value: string
    label: string
}

interface SingleSelectProps {
    disabled: boolean
    options: OptionsProps[]
}

export type { AutoCompleteProps, SingleSelectProps }