// import React from "react"
// import styles from "./formatResponseRows.module.css"
// import classNames from "classnames"

interface dataValuesProps {
    dataElement: string
    value: string
}

interface attributesProps {
    attribute: string
    value: string
}

interface enrollmentProps {
    enrolledAt: string
    enrollment: string
    orgUnit: string
    status: string
}

interface formatResponseRowsProps {
    eventsInstances: [{
        trackedEntity: string
        dataValues: dataValuesProps[]
    }]
    teiInstances: [{
        trackedEntity: string
        attributes: attributesProps[]
        enrollments: enrollmentProps[]
    }]
}

type RowsProps = Record<string, string | number | boolean | any>;

export function formatResponseRows({ eventsInstances, teiInstances }: formatResponseRowsProps): RowsProps[] {
    const allRows: RowsProps[] = []
    for (const event of eventsInstances) {
        const teiDetails = teiInstances.find(tei => tei.trackedEntity === event.trackedEntity)
        // const statusStyle = teiDetails?.enrollments[0].status ?? "";
        allRows.push({ /* ...dataValues(event.dataValues), */...(attributes((teiDetails?.attributes) ?? [])), ...{ trackedEntity: teiDetails?.trackedEntity } /* ...{ wue7sdh2h3sdeH: <span className={classNames(styles["status-container"], styles[statusStyle])} >{teiDetails?.enrollments[0].status}</span> } */ })
    }
    return allRows;
}

// function dataValues(data: dataValuesProps[]): RowsProps {
//     const localData: RowsProps = {}
//     for (const dataElement of data) {
//         localData[dataElement.dataElement] = dataElement.value
//     }
//     return localData
// }

function attributes(data: attributesProps[]): RowsProps {
    const localData: RowsProps = {}
    for (const attribute of data) {
        localData[attribute.attribute] = attribute.value
    }
    return localData
}
