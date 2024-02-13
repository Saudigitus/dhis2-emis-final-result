import { type CustomAttributeProps } from '../../AttributeColumns';

interface SelectorContentsProps {
    onClose: () => void
    disabledReset: boolean
    colum: CustomAttributeProps
    onChange: () => void
    value: any
    onQuerySubmit: () => void
    disabled: boolean
}

export type { SelectorContentsProps }