import { useRecoilValue } from "recoil";
import { useState } from "react";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponse } from "../../utils/table/header/formatResponse";
import { DataStoreState } from "../../schema/dataStoreSchema";

export function useHeader() {
    const programConfigState = useRecoilValue(ProgramConfigState);
    const [columnHeader, setcolumnHeader] = useState()
    const getDataStoreData = useRecoilValue(DataStoreState);

    return {
        columns: formatResponse(programConfigState, getDataStoreData?.["final-result"]?.programStage),
        columnHeader,
        setcolumnHeader
    }
}
