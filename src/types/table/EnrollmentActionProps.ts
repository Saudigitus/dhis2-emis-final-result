import { PrintTemplateConfig } from "../printTemplate/PrintTemplateConfig"

interface PrintButtonProps {
    id:string
    label: string
    placeholder: string
    disabled: boolean
}


interface PrintButtonItemProps {
    options: PrintTemplateConfig[]
}

export type { PrintButtonProps, PrintButtonItemProps }