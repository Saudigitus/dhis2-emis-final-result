import {HeadBarTypes} from "../../../types/headBar/HeadBarTypes";
import {HeadBarDataProps} from "../../../types/utils/ConstantsTypes";
import {filterDataElements} from "../../../types/dataStore/DataStoreConfig";

export const headBarDataElements = ({ selectedOptions, getDataStoreData, programStageDataElements}: HeadBarDataProps): HeadBarTypes[] => {
    const headBarFilters: HeadBarTypes[] = []

    getDataStoreData.filters?.dataElements.map((filter: filterDataElements) => {

        if (programStageDataElements) {
            let headBarFilterName: string = '';

            const dataElement = programStageDataElements?.find((psDataElement: any) =>
                psDataElement?.dataElement?.id === filter?.dataElement
            )?.dataElement;

            if (dataElement) {
                headBarFilterName = dataElement.displayName;
            }

            headBarFilters.push({
                disabled: !(selectedOptions.school && selectedOptions.schoolName),
                id: filter.code,
                label: headBarFilterName,
                value: selectedOptions[filter.code] ?? `Select a ${filter.code}`,
                placeholder: `Search for ${filter.code}`,
                dataElementId: filter?.dataElement,
                component: "menuItemContainer",
                selected: selectedOptions[filter.code] ? true : false,
            })
        }
    })

    return headBarFilters
}
