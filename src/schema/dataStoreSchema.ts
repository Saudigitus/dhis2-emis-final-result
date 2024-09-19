import { atom } from "recoil"
import { dataStoreRecord, dataStoreRecordStaffFormConfig } from "../types/dataStore/DataStoreConfig"

export const DataStoreState = atom<dataStoreRecord[]|any>({
    key: "dataStore-get-state",
    default: []
})

export const DataStoreStaffFormConfigState = atom<dataStoreRecordStaffFormConfig | any>({
    key: "dataStore-staff-form-config-state",
    default: null
})