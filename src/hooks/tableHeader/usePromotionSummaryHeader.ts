import { useState } from "react";
import { useRecoilValue } from "recoil";
import { TableColumnState } from "../../schema/columnSchema";
import { ProgramConfigState } from "../../schema/programSchema";
import { formatResponsePromotionSummary } from "../../utils/table/header/formatResponse";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";

export function usePromotionSummaryHeader() {
    const { getDataStoreData } = getSelectedKey();
    const [columnHeader, setcolumnHeader] = useState();
    const tableColumns = useRecoilValue(TableColumnState)
    const programConfigState = useRecoilValue(ProgramConfigState);

    return {
        columns: formatResponsePromotionSummary({data:programConfigState, programStageId: getDataStoreData?.["final-result"]?.programStage, tableColumns,registrationProgramStage:getDataStoreData.registration.programStage}),
        columnHeader,
        setcolumnHeader
    }
}
