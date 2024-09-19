import { useSetRecoilState } from 'recoil';
import { useShowAlerts } from '../../hooks';
import { useDataEngine} from "@dhis2/app-runtime"
import { DataStoreStaffFormConfigState, DataStoreState } from '../../schema/dataStoreSchema';
import { useState,useEffect } from "react"

const DATASTORE_QUERY = ({
    config: {
        resource: "dataStore/semis/values",
        params: {
            fields: "*"
        }
    }
})

const DATASTORE_STAFF_REENROLL_FORMCONFIG = ({
    configStaff: {
        resource: "dataStore/semisStaffConfigReenrollForm/config",
        params: {
            fields: "*"
        }
    }
})

export function useDataStore() {

    const engine = useDataEngine();
    const setDataStoreState = useSetRecoilState(DataStoreState);
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState<boolean>(true)
    const { hide, show } = useShowAlerts()
    const [data, setData] = useState<any>(null)
    const setStaffFormConfigDataStore = useSetRecoilState(DataStoreStaffFormConfigState)

    const getDataStore = () => {
        engine.query(DATASTORE_QUERY)
            .then(async ({ config }) => {

                //GET STAFF FORM CONFIG TO HIDE UNNECESSARY FIELDS ON STAFF REENROLL FORM
                await engine.query(DATASTORE_STAFF_REENROLL_FORMCONFIG)
                    .then(({ configStaff }) => {
                        setStaffFormConfigDataStore(configStaff)
                        setLoading(false)
                    }).catch((errorMsg) => {
                        setLoading(false)
                        show({
                            message: `${("Could not get data")}: ${errorMsg.message}`,
                            type: { critical: true }
                        });
                        setTimeout(hide, 5000);
                    })
                //=======================================================================    
                setData(config)
                setDataStoreState(config)
            })
            .catch((error) => {
                setError(error)
                setLoading(false)
                show({
                    message: `${("Could not get data")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            })
    }

    useEffect(() => {
        getDataStore()
    },[])

    return {
        data,
        loading,
        error,
    }
}
