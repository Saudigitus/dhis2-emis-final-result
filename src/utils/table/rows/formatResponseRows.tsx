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
    trackedEntityAttributes: ProgramConfig['programTrackedEntityAttributes']
}

interface formatResponseRowsMarksProps {
    marksInstance: {
        trackedEntity: string
        dataValues: dataValuesProps[]
    }
}

type RowsProps = Record<string, string | number | boolean | any>;

export function formatResponseRows({ eventsInstances, teiInstances,marksInstances, trackedEntityAttributes }: formatResponseRowsProps): RowsProps[] {
    const allRows: RowsProps[] = []
    for (const event of eventsInstances) {
        const teiDetails = teiInstances.find(tei => tei.trackedEntity === event.trackedEntity)
        const marksDetails = marksInstances.find(mark => mark.trackedEntity === event.trackedEntity)
        allRows.push({...(marksDetails !== undefined ? { ...dataValues(marksDetails.dataValues) } : {}), ...(attributes((teiDetails?.attributes) ?? [],  trackedEntityAttributes)), ...{ trackedEntity: teiDetails?.trackedEntity } })
    }
    return allRows;
}

export function formatResponseRowsMarks({ marksInstance }: formatResponseRowsMarksProps): RowsProps {
    return dataValues(marksInstance?.dataValues ?? [])
}


function dataValues(data: dataValuesProps[]): RowsProps {
    const localData: RowsProps = {}
    for (const dataElement of data) {
        localData[dataElement.dataElement] = <span className={classNames(styles['final-result__status'], styles[dataElement.value.toLowerCase()])}>{dataElement.value}</span>
    }
    return localData
}

function attributes(data: attributesProps[], trackedEntityAttributes: ProgramConfig['programTrackedEntityAttributes']): RowsProps {
    const localData: RowsProps = {}
    for (const attribute of data) {
        const trackedEntityAttribute : any = trackedEntityAttributes?.find((x: any) => x.trackedEntityAttribute.id == attribute.attribute)?.trackedEntityAttribute

        if(trackedEntityAttribute?.optionSet)
            localData[attribute.attribute] = trackedEntityAttribute?.optionSet?.options?.find((x: any) => x.value === attribute.value).label
        
        else
            localData[attribute.attribute] = attribute.value
    }
    return localData
}
