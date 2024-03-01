import { ResetHeaderFilterProps } from "../../types/utils/CommonsTypes";

export function resetHeaderFilter ({ remove, dataElementId, getDataStoreData} : ResetHeaderFilterProps) {
    
    if(dataElementId == getDataStoreData.registration.grade) {
        remove("grade");
    }

    if(dataElementId == getDataStoreData.registration.section) {
        remove("class");
    }

    if(dataElementId == "school") {
        remove("school");
        remove("schoolName");
    }

    if(dataElementId == getDataStoreData.registration.academicYear) {
        remove("academicYear");
    }
}