interface ConfigTableColumnsProps {
    headers: any[]
    updateVariables: (list: any[]) => void
}

interface DialogSelectColumnsProps {
    open: boolean
    onClose: () => void
    headers: any[]
    updateVariables: (list: any[]) => void
}

export type { ConfigTableColumnsProps, DialogSelectColumnsProps }