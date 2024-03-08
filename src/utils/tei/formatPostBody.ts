import { format } from "date-fns";
import { reducer } from "../commons/formatDistinctValue";

export const promoteTeiPostBody = (students: any[], dataValues: any, performanceProgramStages: string[], socioEconomicProgramStage: string): any => {
    const buildEventBody = (program: string, orgUnit: string, enrollment: any) => {
        const events = []
        for (const [key, value] of Object.entries(reducer(dataValues[0]))) {
            events.push({
                occurredAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                notes: [],
                status: "ACTIVE",
                program,
                programStage: key,
                orgUnit,
                scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                dataValues: value
            })
        }

        var socioEconomicDataValues: any[] = []

        enrollment?.events?.forEach((event: any) => {
            if (event?.programStage === socioEconomicProgramStage) {
                event?.dataValues.forEach((dataValue: any) => {
                    socioEconomicDataValues.push({
                        dataElement: dataValue?.dataElement,
                        value: dataValue?.value
                    })
                })
            }
        })

        events.push({
            occurredAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            notes: [],
            status: "ACTIVE",
            program,
            programStage: socioEconomicProgramStage,
            orgUnit,
            scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            dataValues: socioEconomicDataValues
        })


        performanceProgramStages.forEach(performanceProgramStage => {
            events.push({
                occurredAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                notes: [],
                status: "ACTIVE",
                program,
                programStage: performanceProgramStage,
                orgUnit,
                scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
            })
        })

        return events
    }

    const trackedEntities: any[] = students.map(({ orgUnit, trackedEntity, trackedEntityType, attributes, enrollments }) => (
        {
            orgUnit,
            trackedEntity,
            trackedEntityType,
            enrollments: [
                {
                    attributes,
                    program: enrollments[0]?.program,
                    status: "ACTIVE",
                    occurredAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                    orgUnit: enrollments[0]?.orgUnit,
                    enrolledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                    events: buildEventBody(enrollments[0]?.program, enrollments[0]?.orgUnit, enrollments[0])
                }
            ]
        }
    ))

    return { trackedEntities }
}