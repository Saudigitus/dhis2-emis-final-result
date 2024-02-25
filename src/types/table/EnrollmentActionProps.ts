interface PrintButtonProps {
    id:string
    label: string
    placeholder: string
}

type PrintButtonItemOptionType = {
    id:string
    label: string
    value: string
}

interface PrintButtonItemProps {
    options: PrintButtonItemOptionType[]
}

export type { PrintButtonProps, PrintButtonItemProps, PrintButtonItemOptionType }