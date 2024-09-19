import { useSetRecoilState } from 'recoil';
import { useShowAlerts } from '../../hooks';
import { useDataEngine, useDataQuery } from "@dhis2/app-runtime"
import { DataStoreStaffFormConfigState, DataStoreState } from '../../schema/dataStoreSchema';
import { useState } from "react"

const DATASTORE_QUERY = ({
    config: {
        resource: "dataStore/semisStaffConfigReenrollForm/values",
        params: {
            fields: "*"
        }
    }
})

const DATASTORE_STAFF_REENROLL_FORMCONFIG = ({
    config: {
        resource: "dataStore/semisStaffConfigReenrollForm/config",
        params: {
            fields: "*"
        }
    }
})

export function useDataStore() {

    const engine = useDataEngine();
    const [loader, setLoader] = useState<boolean>(true)
    const setDataStoreState = useSetRecoilState(DataStoreState);
    const { hide, show } = useShowAlerts()
    const setStaffFormConfigDataStore = useSetRecoilState(DataStoreStaffFormConfigState)

    const { data, loading, error } = useDataQuery<{ config: any }>(DATASTORE_QUERY, {
        onError(error) {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        },
        async onComplete(response) {
            //GET STAFF FORM CONFIG TO HIDE UNNECESSARY FIELDS ON STAFF REENROLL FORM
            await engine.query(DATASTORE_STAFF_REENROLL_FORMCONFIG)
                .then(({ config }) => {
                    setStaffFormConfigDataStore(config)
                    setLoader(false)
                }).catch((errorMsg) => {
                    setLoader(false)
                    show({
                        message: `${("Could not get data")}: ${errorMsg.message}`,
                        type: { critical: true }
                    });
                    setTimeout(hide, 5000);
                })
            //=======================================================================    
            setDataStoreState(response?.config)
        }
    })

    return {
        data,
        loading,
        error,
        loader
    }
}
