import { dataStoreRecord, filterDataElements } from "../dataStore/DataStoreConfig";
import { SelectedOptionsTypes } from "../headBar/HeadBarTypes";
import { programStageDataElements } from "../programStageConfig/ProgramStageConfig";

interface HeadBarDataProps {
    selectedOptions: SelectedOptionsTypes
    getDataStoreData: dataStoreRecord
    programStageDataElements: programStageDataElements[]
}

interface SideBarDataProps {
    locationParms : string
    filterDataElements: filterDataElements[]
}

type SideBarDataRouteProps = {
    location: string 
    sectionType: string
    filterDataElements : filterDataElements[]
    removeParams?:boolean
}


export type { HeadBarDataProps, SideBarDataProps, SideBarDataRouteProps, }