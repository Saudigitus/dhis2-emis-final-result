import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../schema/programSchema';
import { DataStoreState } from '../../schema/dataStoreSchema';
import { formatResponseEvents } from '../../utils/events/formatResponseEvents';

export default function useGetEnrollmentForm() {
    const [enrollmentsData, setEnrollmentsData] = useState<any[]>([])
    const getProgram = useRecoilValue(ProgramConfigState);
    const getDataStoreData = useRecoilValue(DataStoreState);

    const buildForm = () => {
        if (getDataStoreData != null && getProgram !== undefined) {
            const { "final-result": { programStage } } = getDataStoreData
            const { programStages } = getProgram
            const finalResultProgramStage = programStages.filter(elemnt => elemnt.id === programStage)[0]
            setEnrollmentsData([formatResponseEvents(finalResultProgramStage)])
        }
    }
    useEffect(() => {
        buildForm()
    }, [])

    return { enrollmentsData }
}
