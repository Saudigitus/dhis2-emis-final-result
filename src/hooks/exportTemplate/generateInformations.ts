import { useDataEngine, useDataQuery } from "@dhis2/app-runtime"
import { useSearchParams } from "react-router-dom"
import { useExportTemplateProps } from "../../types/modal/ModalProps"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"
import { format } from "date-fns"
import { VariablesTypes } from "../../types/variables/AttributeColumns"

export enum SectionVariablesTypes {
    EnrollmentDetails = "Enrollment Details",
    Profile = "Student Profile",
    FinalResults = "Final Results"
}

const oneProgramQuery: any = {
    program: {
        resource: "programs",
        id: ({ programId }: { programId: string }) => programId,
        params: {
            fields: [
                "id,displayName,programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,displayName,valueType,unique,generated,optionSetValue,optionSet[id,displayName,options[id,displayName,code]]]],programStages[id,displayName,programStageDataElements[compulsory,dataElement[id,displayName,valueType,optionSetValue,optionSet[id,displayName,options[id,displayName,code]]]]"
            ]
        }
    }
}

const reserveValuesQuery: any = {
    values: {
        resource: "trackedEntityAttributes",
        id: ({ numberOfReserve, attributeID }: {
            numberOfReserve: number
            attributeID: string
        }) => `${attributeID}/generateAndReserve?numberToReserve=${numberOfReserve}`
    }
}


export function useGenerateInfo() {
    const [searchParams, _] = useSearchParams()
    const { refetch: loadOneProgram } = useDataQuery(oneProgramQuery, { lazy: true })
    const { refetch: loadReserveValues } = useDataQuery(reserveValuesQuery, { lazy: true })
    const { getDataStoreData: programConfigDataStore } = getSelectedKey()
    const engine = useDataEngine()

    async function generateInformations(inputValues: useExportTemplateProps) {
        const sectionType: string | null = searchParams.get("sectionType")

        if (!sectionType) {
            throw new Error("Couldn't find section type in url params")
        }
        if (!programConfigDataStore?.program) {
            throw Error("Couldn't get program uid from datastore << values >>")
        }
        const { program: programId, registration }: any = programConfigDataStore
        const correspondingProgram: any = await engine.query(oneProgramQuery, { variables: { programId } })

        if (!correspondingProgram?.program) {
            throw Error(`Couldn't find program << ${programId} >> in DHIS2`)
        }

        if (!registration) {
            throw Error(`Couldn't find registration config in datastore`)
        }

        if (!programConfigDataStore?.["final-result"]) {
            throw Error(`Couldn't find final-result config in datastore`)
        }

        const currentAttributes =
            correspondingProgram?.program?.programTrackedEntityAttributes?.map(
                (p: { mandatory: boolean; trackedEntityAttribute: any }) => {
                    return { mandatory: p.mandatory, ...p.trackedEntityAttribute }
                }
            ) || []

        let newHeaders: any = []
        const newDataList: any = []

        if (currentAttributes.length > 0) {
            newHeaders = currentAttributes.map((attribute: any) => ({
                key: attribute.id,
                id: attribute.id,
                unique: attribute.unique || false,
                generated: attribute.generated || false,
                valueType: attribute.valueType,
                label: attribute.displayName,
                optionSetValue: attribute.optionSetValue || false,
                options: attribute.optionSet?.options || [],
                optionSetId: attribute.optionSet?.id || null,
                required: attribute.mandatory || false,
                metadataType: VariablesTypes.Attribute,
                sectionDataType: SectionVariablesTypes.Profile
            }))
        }

        const reserveValuePayload: any = {}

        for (let attr of newHeaders) {
            if (attr.unique && attr.generated) {
                const reserveValueResponse: any = await engine.query(reserveValuesQuery, { variables: { numberOfReserve: +inputValues.studentsNumber, attributeID: attr.id } })
                if (reserveValueResponse?.values?.length > 0) {
                    reserveValuePayload[`${attr.id}`] = reserveValueResponse.values
                }
            }
        }

        const registrationProgramStageDataElements =
            correspondingProgram?.program?.programStages?.reduce(
                (prev: any, curr: any) => {
                    if (curr.id === registration.programStage) {
                        const newDataElements =
                            curr.programStageDataElements?.reduce(
                                (dxPrev: any, dxCurr: any) => {
                                    dxPrev.push({
                                        key: `${registration.programStage}.${dxCurr.dataElement?.id}`,
                                        id: `${registration?.programStage}.${dxCurr.dataElement?.id}`,
                                        label: dxCurr.dataElement?.displayName,
                                        valueType: dxCurr.dataElement?.valueType,
                                        optionSetValue: dxCurr.dataElement?.optionSetValue || false,
                                        options: dxCurr.dataElement?.optionSet?.options || [],
                                        optionSetId: dxCurr.dataElement?.optionSet?.id || null,
                                        required: dxCurr?.compulsory || false,
                                        metadataType: VariablesTypes.DataElement,
                                        sectionDataType: SectionVariablesTypes.EnrollmentDetails
                                    })
                                    return dxPrev
                                },
                                []
                            ) || []

                        prev = [...prev, ...newDataElements]
                        return prev
                    }

                    return prev
                }, []) || []

        const finalResultsProgramStageDataElements =
            correspondingProgram?.program?.programStages?.reduce(
                (prev: any, curr: any) => {
                    if (
                        curr.id === programConfigDataStore?.["final-result"]?.programStage
                    ) {
                        const newDataElements =
                            curr.programStageDataElements?.reduce(
                                (dxPrev: any, dxCurr: any) => {
                                    dxPrev.push({
                                        key: `${programConfigDataStore?.["final-result"]?.programStage}.${dxCurr.dataElement?.id}`,
                                        id: `${programConfigDataStore?.["final-result"]?.programStage}.${dxCurr.dataElement?.id}`,
                                        label: dxCurr.dataElement?.displayName,
                                        valueType: dxCurr.dataElement?.valueType,
                                        optionSetValue: dxCurr.dataElement?.optionSetValue || false,
                                        options: dxCurr.dataElement?.optionSet?.options || [],
                                        optionSetId: dxCurr.dataElement?.optionSet?.id || null,
                                        required: dxCurr?.compulsory || false,
                                        metadataType: VariablesTypes.DataElement,
                                        sectionDataType: SectionVariablesTypes.FinalResults
                                    })
                                    return dxPrev
                                },
                                []
                            ) || []
                        prev = [...prev, ...newDataElements]
                        return prev
                    }
                    return prev
                },
                []
            ) || []

        const newBeginHeaders = [
            {
                key: `ref`,
                id: `ref`,
                label: "Ref",
                valueType: "TEXT",
                optionSetValue: false,
                options: [],
                optionSetId: null,
                required: false
            },
            {
                key: `orgUnitName`,
                id: `orgUnitName`,
                label: "School Name",
                valueType: "TEXT",
                optionSetValue: false,
                options: [],
                optionSetId: null,
                required: true
            },
            {
                key: `orgUnit`,
                id: `orgUnit`,
                label: "School UID",
                valueType: "TEXT",
                optionSetValue: false,
                options: [],
                optionSetId: null,
                required: true
            },
            {
                key: `trackedEntity`,
                id: `trackedEntity`,
                label: "Tracked Entity",
                valueType: "TEXT",
                optionSetValue: false,
                options: [],
                optionSetId: null,
                required: true
            },
            {
                key: `enrollmentDate`,
                id: `enrollmentDate`,
                label: "Enrollment date",
                valueType: "DATE",
                optionSetValue: false,
                options: [],
                optionSetId: null,
                required: true
            },
            {
                key: `enrollment`,
                id: `enrollment`,
                label: "Enrollment",
                valueType: "TEXT",
                optionSetValue: false,
                options: [],
                optionSetId: null,
                required: true
            },
            {
                key: `event`,
                id: `event`,
                label: "Event",
                valueType: "TEXT",
                optionSetValue: false,
                options: [],
                optionSetId: null,
                required: true
            },
            {
                key: `occurredAt`,
                id: `occurredAt`,
                label: "Event Date",
                valueType: "DATE",
                optionSetValue: false,
                options: [],
                optionSetId: null,
                required: true
            }
        ]

        const newBeginHeadersFormatted = newBeginHeaders.map((header) => {
            return {
                ...header,
                metadataType: VariablesTypes.Default,
                sectionDataType: SectionVariablesTypes.EnrollmentDetails
            }
        })

        newHeaders = [
            ...newBeginHeadersFormatted,
            ...newHeaders,
            ...registrationProgramStageDataElements,
            ...finalResultsProgramStageDataElements
        ]

        if (+inputValues.studentsNumber > 0) {
            for (let i = 0; i < +inputValues.studentsNumber; i++) {
                const payload: any = {}
                let incrementHeader = 0
                for (let newHeader of newHeaders) {
                    let value = ""
                    if (incrementHeader === 0) value = `${i + 1}`
                    if (incrementHeader === 1) value = `${inputValues.orgUnitName}`
                    if (incrementHeader === 2) value = `${inputValues.orgUnit}`
                    if (incrementHeader === 3)
                        value = `${format(
                            new Date(),
                            `${inputValues.academicYearId}-MM-dd`
                        )}`
                    if (incrementHeader === 4) value = `${inputValues.academicYearId}`

                    if (incrementHeader > 3) {
                        const found_reserv = reserveValuePayload[newHeader.id]
                        if (found_reserv) {
                            value = found_reserv[0].value
                            reserveValuePayload[newHeader.id] = reserveValuePayload[
                                newHeader.id
                            ].filter((resVam: { value: any }) => value !== resVam.value)
                        }
                    }

                    payload[`${newHeader.id}`] = {
                        label: newHeader.label,
                        value
                    }
                    incrementHeader++
                }

                newDataList.push(payload)
            }
        }

        return {
            headers: newHeaders || [],
            datas: newDataList || [],
            currentProgram: correspondingProgram
        }
    }

    return { generateInformations }
}