import { ProgramConfig } from "../../../types/programConfig/ProgramConfig";
import { attributesProps } from "../../../types/table/TableData";
import { FormatResponsePromotionSummaryRowsDataProps, RowsDataProps } from "../../../types/utils/table/FormatRowsDataTypes";

export function formatPromotionSummaryRows({ teiInstances, programConfig }: FormatResponsePromotionSummaryRowsDataProps): RowsDataProps[] {
    // Check if teiInstances is an array before processing
    if (!Array.isArray(teiInstances)) {
        console.error("teiInstances is not an array", teiInstances);
        return []; // Return an empty array if teiInstances is invalid
    }

    const allRows: RowsDataProps[] = [];

    // Loop through teiInstances, which is now guaranteed to be an array
    for (const teiInstance of teiInstances) {
        allRows.push({
            ...attributes(teiInstance?.attributes ?? [], programConfig),
            trackedEntity: teiInstance?.trackedEntity
        });
    }
    return allRows;
}

function attributes(data: attributesProps[] = [], programConfig: ProgramConfig): RowsDataProps {
    const localData: RowsDataProps = {};

    for (const attribute of data) {
        const trackedEntityAttribute: any = programConfig?.programTrackedEntityAttributes?.find(
            (option: any) => option.trackedEntityAttribute.id === attribute.attribute
        )?.trackedEntityAttribute;

        if (trackedEntityAttribute?.optionSet) {
            const foundOption = trackedEntityAttribute.optionSet.options?.find(
                (option: any) => option.value === attribute.value
            );
            localData[attribute.attribute] = foundOption?.label || attribute.value;
        } else {
            localData[attribute.attribute] = attribute.value;
        }
    }
    return localData;
}
