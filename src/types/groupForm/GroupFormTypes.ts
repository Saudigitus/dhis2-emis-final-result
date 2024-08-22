import { type CustomAttributeProps } from "../../types/variables/AttributeColumns"

interface GroupFormProps {
  name: string
  description: string
  fields: CustomAttributeProps[]
  disabled: boolean
}

export { type GroupFormProps }
