import { useState } from "react"
import { useRecoilValue } from "recoil"
import { TableColumnState } from "../../schema/columnSchema"
import { ProgramConfigState } from "../../schema/programSchema"
import { formatResponse } from "../../utils/table/header/formatResponse"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"

export function useHeader() {
  const { getDataStoreData } = getSelectedKey()
  const [columnHeader, setcolumnHeader] = useState()
  const tableColumns = useRecoilValue(TableColumnState)
  const programConfigState = useRecoilValue(ProgramConfigState)

  return {
    columns: formatResponse({
      data: programConfigState,
      tableColumns,
      registrationProgramStage: getDataStoreData?.registration?.programStage
    }),
    columnHeader,
    setcolumnHeader
  }
}
