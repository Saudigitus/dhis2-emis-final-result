import { useRecoilState } from "recoil";
import { useShowAlerts } from '../../hooks';
import { useDataMutation } from "@dhis2/app-runtime"
import { teiRefetch } from '../../schema/teiRefetchSchema';

const POST_TEI: any = {
    resource: "tracker",
    type: 'create',
    data: ({ data }: any) => data,
    params: {
        async: false
    }
}


export default function usePostTei() {
    const { hide, show } = useShowAlerts()
    const [refetch, setRefetch] = useRecoilState<boolean>(teiRefetch)

    const [create, { loading, data }] = useDataMutation(POST_TEI, {
        onComplete: () => {
            show({ message: "Enrollment saved successfully", type: { success: true } })
            setRefetch(!refetch)
        },
        onError: (error) => {
            show({
                message: `Could not save the enrollment details: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }
    });

    return {
        loading,
        postTei: create,
        data
    }
}
