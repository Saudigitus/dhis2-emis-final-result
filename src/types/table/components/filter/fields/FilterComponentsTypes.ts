import { type CustomAttributeProps } from '../../../../../types/table/AttributeColumns';

interface FilterComponentProps {
    type: CustomAttributeProps['valueType']
    column: CustomAttributeProps
    onChange: () => void
    value: any
    id: string
    options: { optionSet: { options: [{ value: string, label: string }] } }
}

export type { FilterComponentProps }