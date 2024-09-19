interface ButtonActionProps {
  label: string
  primary?: boolean
  destructive?: boolean
  secondary?: boolean
  disabled: boolean
  loading: boolean
  onClick: () => void
  className?: any
}

export type { ButtonActionProps }
