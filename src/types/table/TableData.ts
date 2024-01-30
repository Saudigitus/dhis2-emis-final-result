export type TableDataProps = Record<string, string>;

export interface EventQueryProps {
    page?: number
    pageSize?: number
    ouMode: string
    program: string
    order: string
    programStatus: string
    programStage: string
    trackedEntity?: string
    orgUnit: string
    filter?: string[]
    filterAttributes?: string[]
}

export interface TeiQueryProps {
    program: string
    pageSize: number
    ouMode: string
    trackedEntity: string
    orgUnit: string
    order: string
}

export interface dataValuesProps {
    dataElement: string
    value: string
}

export interface attributesProps {
    attribute: string
    value: string
}

export interface EventQueryResults {
    results: {
        instances: [{
            trackedEntity: string
            dataValues: dataValuesProps[]
        }]
    }
}

export interface MarksQueryResults {
    results: {
        instances: any
    }
}
export interface TeiQueryResults {
    results: {
        instances: [{
            trackedEntity: string
            attributes: attributesProps[]
        }]
    }
}
