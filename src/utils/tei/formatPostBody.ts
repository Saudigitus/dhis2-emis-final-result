import { format } from "date-fns";
import { reducer } from "../commons/formatDistinctValue";

export const promoteTeiPostBody = (students: any, dataValues: any, performanceProgramStages: string[], socioEconomicProgramStage: string, enrollmentDate: string): any => {
    const buildEventBody = (program: string, orgUnit: string, socioEvents: any) => {
        const events = []

        for (const [key, value] of Object.entries(reducer(dataValues[0]))) {
            events.push({
                occurredAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                notes: [],
                status: "ACTIVE",
                program,
                programStage: key,
                orgUnit,
                scheduledAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                dataValues: value
            })
        }

        //REPLICATING SOCIO ECONIMIC EVENTS
        var socioEconomicDataValues: any[] = []

        socioEvents?.dataValues.forEach((dataValue: any) => {
            socioEconomicDataValues.push({
                dataElement: dataValue?.dataElement,
                value: dataValue?.value
            })
        })
        events.push({
            occurredAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            notes: [],
            status: "ACTIVE",
            program,
            programStage: socioEconomicProgramStage,
            orgUnit,
            scheduledAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            dataValues: socioEconomicDataValues
        })

        /////////////////////

        //CREATING  EMPTIES  EVENTS FOR PERFORMANCE AND FINAL RESULT PROGRAM STAGE
        performanceProgramStages.forEach(performanceProgramStage => {
            events.push({
                occurredAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                notes: [],
                status: "ACTIVE",
                program,
                programStage: performanceProgramStage,
                orgUnit,
                scheduledAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
            })
        })

        return events
    }
    ////////////////////

    const trackedEntities: any[] = students.map(({ orgUnit, trackedEntity, trackedEntityType, attributes, enrollments, socioEvents }: { orgUnit: string, trackedEntity: string, trackedEntityType: string, attributes: any, enrollments: any, socioEvents: any }) => (
        {
            orgUnit,
            trackedEntity,
            trackedEntityType,
            enrollments: [
                {
                    attributes,
                    program: enrollments[0]?.program,
                    status: "COMPLETED",
                    occurredAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                    orgUnit,
                    enrolledAt: format(new Date(enrollmentDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                    events: buildEventBody(enrollments[0]?.program, orgUnit, socioEvents)
                }
            ]
        }
    ))

    return { trackedEntities }
}