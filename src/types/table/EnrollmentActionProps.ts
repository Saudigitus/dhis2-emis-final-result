import { PrintTemplateConfig } from "../printTemplate/PrintTemplateConfig"

interface PrintButtonProps {
    id:string
    label: string
    placeholder: string
    disabled: boolean
}


interface PrintButtonItemProps {
    onToggle: () => void
    options: PrintTemplateConfig[]
}

export type { PrintButtonProps, PrintButtonItemProps }