import React from 'react'
import classNames from 'classnames'
import styles from './formatResponseRows.module.css'
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig'

interface dataValuesProps {
    dataElement: string
    value: string
}

interface attributesProps {
    attribute: string
    value: string
}

interface formatResponseRowsProps {
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
    programStageId:string | undefined
}

interface formatResponseRowsMarksProps {
    marksInstance: {
        trackedEntity: string
        dataValues: dataValuesProps[]
    }
    programConfig: ProgramConfig
    programStageId:string | undefined
}

type RowsProps = Record<string, string | number | boolean | any>;

export function formatResponseRows({ eventsInstances, teiInstances,marksInstances, programConfig, programStageId }: formatResponseRowsProps): RowsProps[] {
    const allRows: RowsProps[] = []
    for (const event of eventsInstances) {
        const teiDetails = teiInstances.find(tei => tei.trackedEntity === event.trackedEntity)
        const marksDetails = marksInstances.find(mark => mark.trackedEntity === event.trackedEntity)
        allRows.push({...(marksDetails !== undefined ? { ...dataValues(marksDetails.dataValues, programConfig, programStageId) } : {}), ...(attributes((teiDetails?.attributes) ?? [], programConfig)), ...{ trackedEntity: teiDetails?.trackedEntity } })
    }
    return allRows;
}

export function formatResponseRowsMarks({ marksInstance, programConfig, programStageId }: formatResponseRowsMarksProps): RowsProps {
    return dataValues(marksInstance?.dataValues ?? [], programConfig, programStageId)
}


function dataValues(data: dataValuesProps[], programConfig: ProgramConfig, programStageId:string | undefined): RowsProps {
    const localData: RowsProps = {}
    const currentProgramStage = ((programConfig?.programStages?.find(programStage => programStage.id === programStageId)) ?? {} as ProgramConfig["programStages"][0])

    if (data) {
        for (const dataElement of data) {
            const dataElementOptSet = currentProgramStage?.programStageDataElements?.find((option: any) => option.dataElement.id == dataElement.dataElement)?.dataElement?.optionSet

            if(dataElementOptSet)
                localData[dataElement.dataElement] = dataElementOptSet?.options?.find((option: any) => option.value === dataElement.value).label as unknown as string
            else
                localData[dataElement.dataElement] = dataElement.value
        }
    }
    return localData
}

function attributes(data: attributesProps[], programConfig: ProgramConfig): RowsProps {
    const localData: RowsProps = {}
    
    for (const attribute of data) {
        const trackedEntityAttribute : any = programConfig?.programTrackedEntityAttributes?.find((option: any) => option.trackedEntityAttribute.id == attribute.attribute)?.trackedEntityAttribute
        
        if(trackedEntityAttribute?.optionSet)
            localData[attribute.attribute] = trackedEntityAttribute?.optionSet?.options?.find((option: any) => option.value === attribute.value).label
        
        else
            localData[attribute.attribute] = attribute.value
    }
    return localData
}
