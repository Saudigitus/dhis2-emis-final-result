/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useDataMutation } from "@dhis2/app-runtime"
import { promoteTeiPostBody } from "../../utils/tei/formatPostBody"
import useShowAlerts from '../commons/useShowAlert';

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
    const [mutate] = useDataMutation(UPDATE_ENROLLMENT_MUTATION)
    const { hide, show } = useShowAlerts()

    const promoteStudents = async (students: any[], fieldsWitValue: any) => {
        // GET AND CLOSE ACTIVE ENROLLMENTS
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
                await mutate({ data: promoteTeiPostBody(studentsToPromote, fieldsWitValue) })
                    .then(() => {
                        show({ message: "Promotion completed successfully", type: { success: true } })
                    })
            })
    }

    return { promoteStudents }
}
export default usePromoteStudent
