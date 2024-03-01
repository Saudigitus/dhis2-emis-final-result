/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Attribute } from "../../types/generated/models";
import { dataStoreRecord } from "../../types/dataStore/DataStoreConfig";
import { ProgramConfig } from "../../types/programConfig/ProgramConfig";
import { FormatResponseEventsProps } from "../../types/utils/FormatResponseEventsTypes";
import { VariablesTypes, type CustomAttributeProps } from "../../types/variables/AttributeColumns";

export function formatResponseEvents({ event }: FormatResponseEventsProps) {
    const dataElements: CustomAttributeProps[] = [];
    if (event != null) {
        for (const programStageDataElement of event?.programStageDataElements) {
            dataElements.push({
                required: programStageDataElement.compulsory,
                name: programStageDataElement.dataElement.id,
                labelName: programStageDataElement.dataElement.displayName,
                valueType: ((programStageDataElement.dataElement?.optionSet) != null) ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : programStageDataElement.dataElement?.valueType as unknown as CustomAttributeProps["valueType"],
                options: { optionSet: programStageDataElement.dataElement?.optionSet ?? undefined },
                disabled: false,
                pattern: "",
                visible: true,
                description: programStageDataElement.dataElement.displayName,
                searchable: programStageDataElement.dataElement.displayInReports,
                error: false,
                programStage: event?.id,
                content: "",
                id: programStageDataElement.dataElement?.id,
                displayName: programStageDataElement.dataElement?.displayName,
                header: programStageDataElement.dataElement?.displayName,
                type: VariablesTypes.DataElement,
                assignedValue: undefined
            });
        }
    }
    return dataElements;
}

export function formatResponseHeader(event: ProgramConfig, getDataStoreData: dataStoreRecord) {
    const dataElements: CustomAttributeProps[] = [];
    const originalData = ((event?.programStages?.find(programStge => programStge.id === getDataStoreData?.registration?.programStage)) ?? {} as ProgramConfig["programStages"][0])
    if (event != null) {
        for (const programStageDataElement of originalData.programStageDataElements) {
            dataElements.push({
                required: programStageDataElement.compulsory,
                name: programStageDataElement.dataElement.id,
                labelName: programStageDataElement.dataElement.displayName,
                valueType: ((programStageDataElement.dataElement?.optionSet) != null) ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : programStageDataElement.dataElement?.valueType as unknown as CustomAttributeProps["valueType"],
                options: { optionSet: programStageDataElement.dataElement?.optionSet ?? undefined },
                disabled: false,
                pattern: "",
                visible: true,
                description: programStageDataElement.dataElement.displayName,
                searchable: programStageDataElement.dataElement.displayInReports,
                error: false,
                programStage: event?.id,
                content: "",
                id: programStageDataElement.dataElement?.id,
                displayName: programStageDataElement.dataElement?.displayName,
                header: programStageDataElement.dataElement?.displayName,
                type: VariablesTypes.DataElement,
                assignedValue: undefined
            });
        }
    }
    return dataElements;
}
