import { Attribute } from "../../types/generated/models";
import { FormatAttributesProps } from "../../types/utils/TeiTypes";
import { VariablesTypes, type CustomAttributeProps } from "../../types/variables/AttributeColumns"

export function formatResponseTEI({attributes}: FormatAttributesProps) {
    const headers: CustomAttributeProps[] = [];
    if (attributes != null) {
        for (const trackedEntityAttribute of attributes.programTrackedEntityAttributes) {
            headers.push({
                required: trackedEntityAttribute?.mandatory,
                name: trackedEntityAttribute?.trackedEntityAttribute?.id,
                labelName: trackedEntityAttribute?.trackedEntityAttribute?.displayName,
                valueType: ((trackedEntityAttribute?.trackedEntityAttribute?.optionSet) != null) ? Attribute.valueType.LIST as unknown as CustomAttributeProps["valueType"] : trackedEntityAttribute?.trackedEntityAttribute?.valueType as unknown as CustomAttributeProps["valueType"],
                options: { optionSet: trackedEntityAttribute?.trackedEntityAttribute.optionSet },
                visible: true,
                disabled: trackedEntityAttribute?.trackedEntityAttribute?.generated,
                pattern: trackedEntityAttribute?.trackedEntityAttribute?.pattern,
                searchable: trackedEntityAttribute?.searchable,
                error: false,
                content: "",
                id: trackedEntityAttribute?.trackedEntityAttribute?.id,
                displayName: trackedEntityAttribute?.trackedEntityAttribute?.displayName,
                header: trackedEntityAttribute?.trackedEntityAttribute?.displayName,
                type: VariablesTypes.Attribute,
                programStage: "",
                assignedValue: undefined
            });
        }
        return headers;
    }
    return []
}
