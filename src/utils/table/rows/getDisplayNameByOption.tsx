import { type OptionSet } from "../../../types/generated"

interface defaultProps {
    attribute: string
    value?: string
    headers: Array<{
        id: string
        optionSets?: OptionSet[]
    }>
}

export function getDisplayName({ attribute, value = undefined, headers }: defaultProps): string | undefined {
    return value
}
