import { useRecoilState } from "recoil";
import { teiRefetch } from '../../schema/teiRefetchSchema';
import { useShowAlerts } from '../../hooks';
import { useDataMutation } from "@dhis2/app-runtime"
import { promoteTeiPostBody } from "../../utils/tei/formatPostBody"
import { RowSelectionState } from "../../schema/tableSelectedRowsSchema";
import useGetUsedPProgramStages from "../programStages/useGetUsedPProgramStages";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";

const UPDATE_ENROLLMENT_MUTATION: any = {
    resource: "tracker",
    type: 'create',
    data: ({ data }: { data: any }) => data,
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        async: false
    }
}

const usePromoteStudent = () => {
    const [mutate, mutateState] = useDataMutation(UPDATE_ENROLLMENT_MUTATION)
    const { hide, show } = useShowAlerts()
    const [selected, setSelected] = useRecoilState(RowSelectionState);
    const [refetch, setRefetch] = useRecoilState<boolean>(teiRefetch);
    const performanceProgramStages = useGetUsedPProgramStages()
    const { getDataStoreData } = getSelectedKey();

    const promoteStudents = async (students: any[], fieldsWitValue: any, enrollmentDate: string, setOpenSummary: (openSummary: boolean) => void, setSummaryData: (summaryData: any) => void) => {

        const studentsUnableSave: any[] = [];
        const studentsAbleToSave: any[] = [];
        for (const student of students) {
            for (const enrollment of student?.enrollments) {
                const registrationEventDataValue = enrollment?.events.filter((event: any) => event.programStage === getDataStoreData.registration.programStage)?.[0]
                    .dataValues?.filter((dataValue: any) => dataValue.dataElement === getDataStoreData.registration.academicYear)?.[0]?.value;
                if (registrationEventDataValue === fieldsWitValue[0].filter((field: any) => field?.id === getDataStoreData.registration.academicYear)?.[0]?.assignedValue) {
                    if (!studentsUnableSave.filter((studentUnableSave: any) => studentUnableSave.trackedEntity === student.trackedEntity)?.[0]) {
                        studentsUnableSave.push(student)
                    }
                }
            }
            if (!studentsAbleToSave.filter((studentAbleToSave: any) => studentAbleToSave.trackedEntity === student.trackedEntity)?.[0] && !studentsUnableSave.filter((studentUnableSave: any) => studentUnableSave.trackedEntity === student.trackedEntity)?.[0]) {
                studentsAbleToSave.push(student)
            }
        }

        if (studentsAbleToSave.length > 0) {
            // GET AND CLOSE ACTIVE ENROLLMENTS OF SELECTED STUDENTS
            const closedEnrollments = studentsAbleToSave.map(student => student?.enrollments.filter((enrollment: any) => enrollment.status === "ACTIVE")[0])
                .map((enrollment: any) => (
                    { ...enrollment, status: "COMPLETED" }
                ))

            await mutate({ data: { enrollments: closedEnrollments } })
                .then(async (response: any) => {
                    // GET CLOSED ENROLLMENTS STUDENTS AFTER POST
                    const studentsToPromote: any = [];
                    response.bundleReport?.typeReportMap?.ENROLLMENT?.objectReports?.map(({ uid }: { uid: string }) => {
                        for (const student of students) {
                            if (student?.enrollments.filter((enrollment: any) => enrollment.enrollment === uid).length > 0) {
                                studentsToPromote.push(student)
                            }
                        }
                    })
                    await mutate({ data: promoteTeiPostBody(studentsToPromote, fieldsWitValue, performanceProgramStages, getDataStoreData["socio-economics"].programStage, enrollmentDate) })
                        .then(() => {
                            setSelected({ ...selected, selectedRows: [], isAllRowsSelected: false })
                            show({ message: "Promotion completed successfully", type: { success: true } })
                            setRefetch(!refetch)
                        })
                })
        }
        setSummaryData({
            created: studentsAbleToSave,
            conflicts: studentsUnableSave
        })
        setOpenSummary(true)

    }

    return { promoteStudents, mutateState }
}
export default usePromoteStudent
