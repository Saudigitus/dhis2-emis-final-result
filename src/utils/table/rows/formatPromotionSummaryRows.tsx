import { ProgramConfig } from "../../../types/programConfig/ProgramConfig";
import { attributesProps } from "../../../types/table/TableData";
import { FormatResponsePromotionSummaryRowsDataProps, RowsDataProps } from "../../../types/utils/table/FormatRowsDataTypes";

export function formatPromotionSummaryRows({teiInstances, programConfig }: FormatResponsePromotionSummaryRowsDataProps): RowsDataProps[] {
    const allRows: RowsDataProps[] = []
    for (const teiInstance of teiInstances) {
        allRows.push({...(attributes((teiInstance?.attributes) ?? [], programConfig)), ...{ trackedEntity: teiInstance?.trackedEntity} })
    }
    return allRows;
}

function attributes(data: attributesProps[], programConfig: ProgramConfig): RowsDataProps {
    const localData: RowsDataProps = {}

    for (const attribute of data) {
        const trackedEntityAttribute: any = programConfig?.programTrackedEntityAttributes?.find((option: any) => option.trackedEntityAttribute.id == attribute.attribute)?.trackedEntityAttribute

        if (trackedEntityAttribute?.optionSet)
            localData[attribute.attribute] = trackedEntityAttribute?.optionSet?.options?.find((option: any) => option.value === attribute.value).label

        else
            localData[attribute.attribute] = attribute.value
    }
    return localData
}