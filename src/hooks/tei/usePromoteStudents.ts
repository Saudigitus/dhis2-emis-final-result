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

    const promoteStudents = async (students: any[], fieldsWitValue: any) => {
        // GET AND CLOSE ACTIVE ENROLLMENTS OF SELECTED STUDENTS
        const closedEnrollments = students.map(student => student?.enrollments.filter((enrollment: any) => enrollment.status === "ACTIVE")[0])
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
                await mutate({ data: promoteTeiPostBody(studentsToPromote, fieldsWitValue, performanceProgramStages, getDataStoreData["socio-economics"].programStage) })
                    .then(() => {
                        setSelected({ ...selected, selectedRows: [], isAllRowsSelected: false })
                        show({ message: "Promotion completed successfully", type: { success: true } })
                        setRefetch(!refetch)
                    })
            })

    }

    return { promoteStudents, mutateState }
}
export default usePromoteStudent
