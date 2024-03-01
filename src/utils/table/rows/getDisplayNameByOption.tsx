import { DefaultProps } from "../../../types/utils/table/FormatRowsDataTypes";

export function getDisplayName({ attribute, value = undefined, headers }: DefaultProps): string | undefined {
    return value
}
