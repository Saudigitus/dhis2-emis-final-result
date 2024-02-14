import { type dataStoreRecord } from "../../types/dataStore/DataStoreConfig"

export function resetHeaderFilter (remove: (key : string) => void, dataElementId: string | any, getDataStoreData: dataStoreRecord) {
    
    if(dataElementId == getDataStoreData.registration.grade) {
        remove("grade");
    }

    if(dataElementId == getDataStoreData.registration.section) {
        remove("class");
    }

    if(dataElementId == undefined) {
        remove("school");
        remove("schoolName");
    }

    if(dataElementId == getDataStoreData.registration.academicYear) {
        remove("academicYear");
    }
}