import { format } from "date-fns";
import { type formType } from "../../types/form/initialFormTypes";
import { reducer } from "../commons/formatDistinctValue";
import { performanceProgramStages } from "../constants/enrollmentForm/performanceProgramStages";

export const promoteTeiPostBody = (students: any[], dataValues: any): any => {
    const buildEventBody = (program: string, orgUnit: string) => {
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
                    events: buildEventBody(enrollments[0]?.program, enrollments[0]?.orgUnit)
                }
            ]
        }
    ))

    return { trackedEntities }
}

export const teiPostBody = (enrollmentsData: any[], programId: string, orgUnit: string, enrollmentDate: string) => {
    const form: formType = {
        attributes: [],
        events: []
    }

    for (const enrollmentData of enrollmentsData) {
        if (enrollmentData[0].type === "attribute") {
            enrollmentData.forEach((attribute: any) => {
                if (attribute.value !== undefined) {
                    form.attributes.push({ attribute: attribute.id, value: attribute.value })
                }
            });
        } else if (enrollmentData[0].type === "dataElement") {
            for (const [key, value] of Object.entries(reducer(enrollmentData))) {
                form.events.push({
                    occurredAt: enrollmentDate,
                    notes: [],
                    status: "ACTIVE",
                    program: programId,
                    programStage: key,
                    orgUnit,
                    scheduledAt: enrollmentDate,
                    dataValues: value
                })
            }
        }
    }

    performanceProgramStages.forEach(performanceProgramStage => {
        form.events.push({
            occurredAt: enrollmentDate,
            notes: [],
            status: "ACTIVE",
            program: programId,
            programStage: performanceProgramStage,
            orgUnit,
            scheduledAt: enrollmentDate
        })
    })

    return {
        trackedEntities: [
            {
                enrollments: [
                    {
                        occurredAt: null,
                        enrolledAt: enrollmentDate,
                        program: programId,
                        orgUnit,
                        attributes: form.attributes,
                        status: "ACTIVE",
                        events: form.events
                    }
                ],
                orgUnit,
                trackedEntityType: "eMLK4VQm3Kj"
            }
        ]
    }
}
