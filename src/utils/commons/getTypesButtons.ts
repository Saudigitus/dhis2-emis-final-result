import { GetTypesOfButtonProps } from "../../types/utils/CommonsTypes"

export function getTypesOfButton(props: GetTypesOfButtonProps) {
    const possibleTypes = ['primary', 'success', 'error', 'secondary', 'info', 'dark', 'warning']
    for (const type of possibleTypes) {
        if (type === props.type) {
            return type
        }
    }
}
