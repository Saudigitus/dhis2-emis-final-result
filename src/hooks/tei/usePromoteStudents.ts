
import { useRecoilState } from "recoil";
import { teiRefetch } from '../../schema/teiRefetchSchema';
import { useShowAlerts } from '../../hooks';
import { useDataMutation, useDataEngine } from "@dhis2/app-runtime"
import { promoteTeiPostBody } from "../../utils/tei/formatPostBody"
import { RowSelectionState } from "../../schema/tableSelectedRowsSchema";
import useGetUsedPProgramStages from "../programStages/useGetUsedPProgramStages";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";
import {useState} from "react"

const UPDATE_ENROLLMENT_MUTATION: any = {
    resource: "tracker",
    type: 'create',
    data: ({ data }: { data: any }) => data,
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        async: false
    }
}

const SOCIO_ECONOMIC_EVENTS = {
    events: {
        resource: "tracker/events",
        params: ({ programStage, trackedEntity, program, orgUnit }: Record<string, string>) => ({
            programStage,
            trackedEntity,
            program,
            orgUnit,
            ouMode: "SELECTED",
            fields: "event,enrollment,dataValues[dataElement,value],program,programStage"
        })
    }
}

const REGISTRATION_EVENTS = {
    events: {
        resource: "tracker/events",
        params: ({ programStage, trackedEntity, program, orgUnit, academicYearDataElement, selectedAcademicYear }: Record<string, string>) => ({
            programStage,
            trackedEntity,
            program,
            orgUnit,
            ouMode: "SELECTED",
            filter: `${academicYearDataElement}:in:${selectedAcademicYear}`,
            fields: "event,enrollment,dataValues[dataElement,value],program,programStage"
        })
    }
}

const usePromoteStudent = () => {
    const engine = useDataEngine();
    const [mutate, mutateState] = useDataMutation(UPDATE_ENROLLMENT_MUTATION)
    const { hide, show } = useShowAlerts()
    const [selected, setSelected] = useRecoilState(RowSelectionState);
    const [refetch, setRefetch] = useRecoilState<boolean>(teiRefetch);
    const performanceProgramStages = useGetUsedPProgramStages()
    const { getDataStoreData } = getSelectedKey();
    const [loadingPromote,setLoadingPromote] = useState<boolean>(false)

    const promoteStudents = async (students: any[], fieldsWitValue: any, enrollmentDate: string, setOpenSummary: (openSummary: boolean) => void, setSummaryData: (summaryData: any) => void) => {
        const studentsUnableSave: any[] = [];
        const studentsAbleToSave: any[] = [];
        setLoadingPromote(true)

        for (const student of students) {
            await engine.query(REGISTRATION_EVENTS,
                {
                    variables: {
                        program: getDataStoreData.program,
                        programStage: getDataStoreData?.registration?.programStage,
                        orgUnit: student?.orgUnit,
                        trackedEntity: student?.trackedEntity,
                        academicYearDataElement: getDataStoreData?.registration?.academicYear,
                        selectedAcademicYear: fieldsWitValue[0].filter((field: any) => field?.id === getDataStoreData?.registration?.academicYear)?.[0]?.assignedValue
                    }
                }
            ).then(async (response: any) => {
                if (response?.events?.instances?.length > 0) {
                    studentsUnableSave.push(student)
                } else if (getDataStoreData?.["socio-economics"]?.programStage) {
                    await engine.query(SOCIO_ECONOMIC_EVENTS, {
                        variables: {
                            program: getDataStoreData.program,
                            programStage: getDataStoreData?.["socio-economics"]?.programStage,
                            orgUnit: student?.orgUnit,
                            trackedEntity: student?.trackedEntity,
                        }
                    }).then((resp: any) => {
                        for (const row of selected.selectedRows as unknown as any) {
                            if (row?.trackedEntity === student?.trackedEntity) {
                                studentsAbleToSave.push({ ...student, socioEvents: resp?.events?.instances?.filter((event: any) => event?.enrollment === row?.enrollment)?.[0] })
                            }
                        }
                    })
                }
                else {
                    for (const row of selected.selectedRows as unknown as any) {
                        if (row?.trackedEntity === student?.trackedEntity) {
                            studentsAbleToSave.push({ ...student })
                        }
                    }     
                }
            }).catch(error => { })
        }

        if (studentsAbleToSave.length > 0) {
            await mutate({ data: promoteTeiPostBody(studentsAbleToSave, fieldsWitValue, performanceProgramStages, getDataStoreData["socio-economics"]?.programStage, enrollmentDate) })
                .then(() => {
                    setSelected({ rows: [], selectedRows: [], isAllRowsSelected: false })
                    show({ message: "Promotion completed successfully", type: { success: true } })
                    setRefetch(!refetch)
                })
        }
        setLoadingPromote(false)
        setSummaryData({
            created: studentsAbleToSave,
            conflicts: studentsUnableSave
        })
        setOpenSummary(true)

    }

    return { promoteStudents, mutateState,loadingPromote }
}
export default usePromoteStudent
