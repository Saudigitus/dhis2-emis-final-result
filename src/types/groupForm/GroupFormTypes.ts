import { type CustomAttributeProps } from "../../types/table/AttributeColumns";

interface GroupFormProps {
    name: string
    description: string
    fields: CustomAttributeProps[]
    disabled: boolean
}

export { type GroupFormProps}