import { useRecoilValue } from "recoil";
import { DataStoreState } from "../../../schema/dataStoreSchema"
import { type dataStoreRecord } from "../../../types/dataStore/DataStoreConfig";
import { useQueryParams } from "../../../hooks";

export const getSelectedKey = () => {
    const { useQuery } = useQueryParams()
    const emisConfig = useRecoilValue(DataStoreState);
    const sectionType = useQuery().get("sectionType");

    const getDataStoreData: dataStoreRecord = sectionType ? emisConfig?.length > 0 ? emisConfig?.find((dataStore: dataStoreRecord) => dataStore.key === sectionType) ?? {} as unknown as dataStoreRecord : {} as unknown as dataStoreRecord : []

    return { getDataStoreData }
}
