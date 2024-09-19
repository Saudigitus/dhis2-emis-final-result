import { useMemo } from "react";
import { Attribute } from "../../../types/generated/models";
import { ProgramConfig } from "../../../types/programConfig/ProgramConfig";
import { CustomAttributeProps, VariablesTypes } from "../../../types/variables/AttributeColumns";
import { FormatResponseProps } from "../../../types/utils/table/TableTypes";

export function formatResponse({ data, tableColumns = [], registrationProgramStage }: FormatResponseProps): CustomAttributeProps[] {
    const headerResponse = useMemo(() => {
        const registration = ((data?.programStages?.find(programStge => programStge.id === registrationProgramStage)) ?? {} as ProgramConfig["programStages"][0])


        return tableColumns?.length > 0 ? tableColumns : data?.programTrackedEntityAttributes?.map((item) => {
            return {
                id: item.trackedEntityAttribute.id,
                displayName: item.trackedEntityAttribute.displayName,
                header: item.trackedEntityAttribute.displayName,
                required: item.mandatory,
                name: item.trackedEntityAttribute.displayName,
                labelName: item.trackedEntityAttribute.displayName,
                valueType: item.trackedEntityAttribute.optionSet?.options?.length > 0 ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : item.trackedEntityAttribute.valueType as unknown as CustomAttributeProps["valueType"],
                options: { optionSet: item.trackedEntityAttribute.optionSet },
                initialOptions: { optionSet: item.trackedEntityAttribute.optionSet },
                visible: item.displayInList,
                disabled: false,
                pattern: '',
                searchable: false,
                error: false,
                content: '',
                key: item.trackedEntityAttribute.id,
                displayInFilters: true,
                type: VariablesTypes.Attribute
            }
        }).concat(
            Object.keys(registration)?.length > 0
                ? registration?.programStageDataElements?.map((programStageDataElement) => {
                    return {
                        id: programStageDataElement.dataElement.id,
                        displayName: programStageDataElement.dataElement.displayName,
                        header: programStageDataElement.dataElement.displayName,
                        required: programStageDataElement.compulsory,
                        name: programStageDataElement.dataElement.displayName,
                        labelName: programStageDataElement.dataElement.displayName,
                        valueType: programStageDataElement.dataElement.optionSet?.options?.length > 0 ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : programStageDataElement.dataElement.valueType as unknown as CustomAttributeProps["valueType"],
                        options: { optionSet: programStageDataElement.dataElement.optionSet },
                        initialOptions: { optionSet: programStageDataElement.dataElement.optionSet },
                        visible: programStageDataElement.displayInReports,
                        disabled: false,
                        pattern: '',
                        searchable: false,
                        error: false,
                        content: '',
                        key: programStageDataElement.dataElement.id,
                        displayInFilters: false,
                        type: VariablesTypes.DataElement
                    }
                }) as []
                : []
        )
    }, [data, tableColumns]);

    return headerResponse;
}

export function formatResponsePromotionSummary({ data, programStageId, tableColumns = [], registrationProgramStage }: FormatResponseProps) {
    return tableColumns?.length > 0 ? tableColumns : data?.programTrackedEntityAttributes?.map((item) => {
        return {
            id: item.trackedEntityAttribute.id,
            displayName: item.trackedEntityAttribute.displayName,
            header: item.trackedEntityAttribute.displayName,
            required: item.mandatory,
            name: item.trackedEntityAttribute.displayName,
            labelName: item.trackedEntityAttribute.displayName,
            valueType: item.trackedEntityAttribute.optionSet?.options?.length > 0 ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : item.trackedEntityAttribute.valueType as unknown as CustomAttributeProps["valueType"],
            options: { optionSet: item.trackedEntityAttribute.optionSet },
            initialOptions: { optionSet: item.trackedEntityAttribute.optionSet },
            visible: item.displayInList,
            disabled: false,
            pattern: '',
            searchable: false,
            error: false,
            content: '',
            key: item.trackedEntityAttribute.id,
            displayInFilters: true,
            type: VariablesTypes.Attribute
        }
    })
}