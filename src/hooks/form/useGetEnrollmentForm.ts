import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { DataStoreState } from '../../schema/dataStoreSchema';
import { formatResponseEvents } from '../../utils/events/formatResponseEvents';

export default function useGetEnrollmentForm() {
    const [enrollmentsData, setEnrollmentsData] = useState<any[]>([])
    const [enrollmentsDetailsData, setEnrollmentsDetailsData] = useState<any[]>([])
    const getProgram = useRecoilValue(ProgramConfigState);
    const getDataStoreData = useRecoilValue(DataStoreState);

    const buildForm = () => {
        if (Object.keys(getDataStoreData)?.length !== 0 && getProgram !== undefined) {
            const { registration, 'socio-economics': { programStage } } = getDataStoreData
            const { programStages } = getProgram
            const enrollmentDetailProgramStage = programStages.filter(elemnt => elemnt.id === registration.programStage)[0]
            const finalResultProgramStage = programStages.filter(elemnt => elemnt.id === programStage)[0]
            setEnrollmentsDetailsData([formatResponseEvents(enrollmentDetailProgramStage)])
            setEnrollmentsData([formatResponseEvents(finalResultProgramStage)])
        }
    }
    useEffect(() => {
        buildForm()
    }, [])

    return { enrollmentsData, enrollmentsDetailsData }
}
