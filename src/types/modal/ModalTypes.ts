interface ModalProps {
    open: boolean
    setOpen: (value: boolean) => void
    title: string
    children: React.ReactNode
}

export { type ModalProps}