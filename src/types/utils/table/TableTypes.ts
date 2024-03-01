import { ProgramConfig } from "../../programConfig/ProgramConfig"
import { CustomAttributeProps } from "../../variables/AttributeColumns"

interface ConvertArrayToObjectProps {
    array: string[][]
}

interface FormatResponseProps {
    data: ProgramConfig, 
    programStageId: string, 
    tableColumns: CustomAttributeProps[]
}

interface HeaderFormatResponseProps {
    data: ProgramConfig
    programStageId: string | undefined
    tableColumns: CustomAttributeProps[]
}

interface DisableNextPageProps { 
    rowsPerPage: number 
    totalPerPage: number 
}

export type { ConvertArrayToObjectProps, HeaderFormatResponseProps, DisableNextPageProps, FormatResponseProps }