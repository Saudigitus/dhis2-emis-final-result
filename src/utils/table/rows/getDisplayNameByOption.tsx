import { defaultProps } from "../../../types/utils/FormatRowsDataProps";

export function getDisplayName({ metaData, value, program }: defaultProps): string {
    const dataElementsWithOptions = program?.programStages?.flatMap((stage:any) => stage?.programStageDataElements?.map((dataElement:any) => dataElement?.dataElement?.optionSet ? dataElement.dataElement : null))?.filter(Boolean);
    const attributesWithOptions = program?.programTrackedEntityAttributes?.flatMap((programAttributes:any) => programAttributes?.trackedEntityAttribute?.optionSet ? programAttributes.trackedEntityAttribute : null)?.filter(Boolean)

    var metaDataOptionSet: any = attributesWithOptions?.filter((x:any) => x?.id === metaData)[0]?.optionSet
    if (metaDataOptionSet === undefined) {
        metaDataOptionSet = dataElementsWithOptions?.filter((x:any) => x?.id === metaData)[0]?.optionSet
    }

    if (metaDataOptionSet) {
                for (const op of metaDataOptionSet?.options || []) {
                    if (op?.value === value) return op?.label
                }
    }
    return value
}
