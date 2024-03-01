import { dataStoreRecord } from "../dataStore/DataStoreConfig"
import { SelectionSchemaConfig } from "../../schema/tableSelectedRowsSchema"

interface CheckIsRowSelectedProps {
    rawRowData: any
    selected: SelectionSchemaConfig
}

interface ReplaceSelectedRowProps {
    rawRowData: any
}

interface FormatDistinctValuesProps {
     array: any[]
}

interface GetTypesOfButtonProps {
     type: string
}
 

interface ResetHeaderFilterProps {
     remove: (key : string) => void, 
     dataElementId: string | any, 
     getDataStoreData: dataStoreRecord
} 

interface FormatToStringProps {
     value: any
}

export type { CheckIsRowSelectedProps, ReplaceSelectedRowProps, FormatDistinctValuesProps, GetTypesOfButtonProps, ResetHeaderFilterProps, FormatToStringProps }