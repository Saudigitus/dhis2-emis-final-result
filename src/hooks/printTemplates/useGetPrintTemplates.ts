import { useShowAlerts } from '..';
import { useSetRecoilState } from 'recoil';
import { useDataQuery } from "@dhis2/app-runtime"
import { PrintTemplateState } from '../../schema/printTemplateSchema';

const TEMPLATE_QUERY = ({
    config: {
        resource: "dataStore/tdp-config/templates",
        params: {
            fields: "*"
        }
    }
})

export function useGetPrintTemplates () {
    const setPrintTemplateState = useSetRecoilState(PrintTemplateState);
    const { hide, show } = useShowAlerts()
    const { data, loading, error } = useDataQuery<{ config: any }>(TEMPLATE_QUERY, {
        onError(error) {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        },
        onComplete(response) {
            setPrintTemplateState(response?.config)
        }
    })

    return {
        data,
        error,
        loading,
    }
}
