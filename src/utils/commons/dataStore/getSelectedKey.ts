import { useRecoilValue } from "recoil";
import { useQueryParams } from "../../../hooks"
import { DataStoreState } from "../../../schema/dataStoreSchema"
import { type dataStoreRecord } from "../../../types/dataStore/DataStoreConfig";

export const getSelectedKey = () => {
    const { useQuery } = useQueryParams()
    const emisConfig = useRecoilValue(DataStoreState);
    const getDataStoreData: dataStoreRecord = emisConfig?.length > 0 ? emisConfig?.find((dataStore: dataStoreRecord) => dataStore?.key === useQuery()?.get("sectionType")) ?? {} as unknown as dataStoreRecord : {} as unknown as dataStoreRecord
    return { getDataStoreData }
}
