import { useRecoilValue } from "recoil"
import { useState, useEffect } from "react"
import { ProgramConfigState } from "../../schema/programSchema"
import { formatResponseEvents } from "../../utils/events/formatResponseEvents"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"

export default function useGetEnrollmentForm() {
  const [enrollmentsData, setEnrollmentsData] = useState<any[]>([])
  const [enrollmentsDetailsData, setEnrollmentsDetailsData] = useState<any[]>(
    []
  )
  const getProgram = useRecoilValue(ProgramConfigState)
  const { getDataStoreData } = getSelectedKey()

  const buildForm = () => {
    if (getDataStoreData != null && getProgram !== undefined) {
      const { programStages } = getProgram
      const enrollmentDetailProgramStage = programStages.filter(
        (elemnt) => elemnt.id === getDataStoreData?.registration?.programStage
      )[0]
      const finalResultProgramStage = programStages.filter(
        (elemnt) =>
          elemnt.id === getDataStoreData?.["final-result"]?.programStage
      )[0]
      setEnrollmentsDetailsData([
        formatResponseEvents({ event: enrollmentDetailProgramStage })
      ])
      setEnrollmentsData([
        formatResponseEvents({ event: finalResultProgramStage })
      ])
    }
  }
  useEffect(() => {
    buildForm()
  }, [])

  return { enrollmentsData, enrollmentsDetailsData }
}
