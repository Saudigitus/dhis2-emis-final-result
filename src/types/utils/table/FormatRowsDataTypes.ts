import { attributesProps } from "../../api/WithRegistrationTypes"
import { dataValuesProps } from "../../api/WithoutRegistrationTypes"
import { ProgramConfig } from "../../programConfig/ProgramConfig"
import { type OptionSet } from "../../../types/generated"

interface FormatResponseRowsDataProps {
    eventsInstances: [{
        trackedEntity: string
        dataValues: dataValuesProps[]
    }]
    teiInstances: [{
        trackedEntity: string
        attributes: attributesProps[]
    }]
    marksInstances: [{
        trackedEntity: string
        dataValues: dataValuesProps[]
    }]
    programConfig: ProgramConfig
    programStageId?: string | undefined
}

interface FormatResponsePromotionSummaryRowsDataProps {

    teiInstances: [{
        trackedEntity: string
        attributes: attributesProps[]
    }]
    programConfig: ProgramConfig
}

type RowsDataProps = Record<string, string | number | boolean | any>;

interface DefaultProps {
    attribute: string 
    value: string | undefined
    headers: Array<{
        id: string
        optionSets?: OptionSet[]
    }>
}

interface FormatResponseRowsMarksProps {
    marksInstance: {
        trackedEntity: string
        dataValues: dataValuesProps[]
    }
    programConfig: ProgramConfig
    programStageId:string | undefined
}

export type {FormatResponsePromotionSummaryRowsDataProps, FormatResponseRowsDataProps, RowsDataProps, DefaultProps, attributesProps, dataValuesProps, FormatResponseRowsMarksProps }