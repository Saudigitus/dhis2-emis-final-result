import { PrintTemplateConfig } from "../printTemplate/PrintTemplateConfig"

interface PrintButtonProps {
    id:string
    label: string
    placeholder: string
}


interface PrintButtonItemProps {
    options: PrintTemplateConfig[]
}

export type { PrintButtonProps, PrintButtonItemProps }