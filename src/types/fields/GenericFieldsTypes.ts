import { type CustomAttributeProps } from "../table/AttributeColumns.js";

interface GenericFieldsProps {
    disabled: boolean
    attribute: CustomAttributeProps
    valueType: CustomAttributeProps["valueType"]
}

export type { GenericFieldsProps}