interface ValueProps {
    endDate: string
    startDate: string
}

interface DateFilterManagerProps {
    onChange: (e: any, id: string, type: string, position: string) => void
    value: ValueProps
    id: string
}

export type { DateFilterManagerProps }