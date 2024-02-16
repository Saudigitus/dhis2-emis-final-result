import { HeadBarTypes, SelectedOptionsTypes } from "../../../types/headBar/HeadBarTypes";
import { filterDataElements, dataStoreRecord } from "../../../types/dataStore/DataStoreConfig";
import { programStageDataElements } from "../../../types/programStageConfig/ProgramStageConfig";

export const headBarDataElements = (selectedOptions : SelectedOptionsTypes, getDataStoreData: dataStoreRecord, programStageDataElements: programStageDataElements[]) : HeadBarTypes[] => {
    const headBarFilters : HeadBarTypes[] = []

    getDataStoreData.filters.dataElements.map((filter : filterDataElements) => {

        if(programStageDataElements){
            console.log(programStageDataElements)
            let headBarFilterName : string  = '';

            const dataElement = programStageDataElements?.find((psDataElement: any) => 
                psDataElement?.dataElement?.id === filter?.dataElement
            )?.dataElement;
            
            if (dataElement)
                headBarFilterName = dataElement.displayName;
            
        
        
            headBarFilters.push({
                id: filter.code,
                label:  headBarFilterName,
                value:  selectedOptions[filter.code] ?? `Select a ${filter.code}`,
                placeholder: `Search for ${filter.code}`,
                dataElementId: filter.dataElement,
                component: "menuItemContainer",
                selected:  selectedOptions[filter.code] ? true : false,
            })
        }
        
    })

    return headBarFilters
}