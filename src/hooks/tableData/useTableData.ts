import React, { useState } from "react"
import { useDataEngine } from "@dhis2/app-runtime"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useQueryParams, useShowAlerts } from "../../hooks"
import { HeaderFieldsState } from "../../schema/headersSchema"
import {
  RowSelectionState,
  TableLoaderState
} from "../../schema/tableSelectedRowsSchema"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows"
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys"
import type {
  EventQueryProps,
  EventQueryResults,
  MarksQueryResults,
  TableDataProps,
  TeiQueryProps,
  TeiQueryResults
} from "../../types/table/TableData"
import { ProgramConfigState } from "../../schema/programSchema"

const EVENT_QUERY = ({
  ouMode,
  page,
  pageSize,
  program,
  order,
  programStage,
  filter,
  orgUnit,
  filterAttributes,
  trackedEntity
}: EventQueryProps) => ({
  results: {
    resource: "tracker/events",
    params: {
      order,
      page,
      pageSize,
      ouMode,
      program,
      programStage,
      orgUnit,
      filter,
      trackedEntity,
      filterAttributes,
      fields: "*"
    }
  }
})

const TEI_QUERY = ({
  ouMode,
  pageSize,
  program,
  trackedEntity,
  orgUnit,
  order,
  programStatus
}: TeiQueryProps) => ({
  results: {
    resource: "tracker/trackedEntities",
    params: {
      program,
      order,
      ouMode,
      programStatus,
      pageSize,
      trackedEntity,
      orgUnit,
      fields:
        "trackedEntity,trackedEntityType,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,orgUnit,program,trackedEntity]"
    }
  }
})

export function useTableData() {
  const engine = useDataEngine()
  const headerFieldsState = useRecoilValue(HeaderFieldsState)
  const programConfig = useRecoilValue(ProgramConfigState)
  const { getDataStoreData } = getSelectedKey()
  const { urlParamiters } = useQueryParams()
  const setLoading = useSetRecoilState<boolean>(TableLoaderState)
  const [tableData, setTableData] = useState<TableDataProps[]>([])
  const { hide, show } = useShowAlerts()
  const { program, registration } = getDataStoreKeys()
  const school = urlParamiters().school as unknown as string
  const [selected, setSelected] = useRecoilState(RowSelectionState)

  async function getData(
    page: number,
    pageSize: number,
    clearSelection: boolean
  ) {
    setLoading(true)

    //GET ALL CURRENT YEAR REAGISTRATION EVENTS
    ;(await engine
      .query(
        EVENT_QUERY({
          ouMode: "SELECTED",
          page,
          pageSize,
          program: program as unknown as string,
          order: "createdAt:desc",
          programStage: registration?.programStage as unknown as string,
          filter: headerFieldsState?.dataElements,
          filterAttributes: headerFieldsState?.attributes,
          orgUnit: school
        })
      )
      .then(async (response: any) => {
        const allTeis: [] = response?.results?.instances.map(
          (x: { trackedEntity: string }) => x.trackedEntity
        )

        //GET ALL TEIS THAT HAVE REGISTRATION EVENTS 'CAUSE WE NEED THEY ATTRIBUTES
        allTeis?.length > 0
          ? ((await engine
              .query(
                TEI_QUERY({
                  program: program as unknown as string,
                  trackedEntity: allTeis.join(";")
                })
              )
              .then(async (teiResponse: any) => {
                //GET FINAL RESULT EVENT FOR EACH STUDENT
                const marskEvents: MarksQueryResults = {
                  results: { instances: [] }
                }

                for (const tei of allTeis) {
                  ;(await engine
                    .query(
                      EVENT_QUERY({
                        // ouMode: "SELECTED",
                        program: program as unknown as string,
                        order: "createdAt:desc",
                        programStage:
                          getDataStoreData?.["final-result"].programStage,
                        // orgUnit: school,
                        trackedEntity: tei
                      })
                    )
                    .then((finalResuntEvent: any) => {
                      marskEvents.results.instances.push(
                        ...finalResuntEvent?.results?.instances
                      )
                    })
                    .catch((error) => {
                      setLoading(false)
                      show({
                        message: `${"Could not get data"}: ${error.message}`,
                        type: { critical: true }
                      })
                      setTimeout(hide, 5000)
                    })) as unknown as MarksQueryResults
                }

                //FORMAT DATA TO LIST ON TABLE
                const localData = formatResponseRows({
                  eventsInstances: response?.results?.instances,
                  teiInstances: teiResponse?.results?.instances,
                  marksInstances: marskEvents?.results?.instances,
                  programConfig: programConfig,
                  programStageId: getDataStoreData["final-result"].programStage
                })

                //FORMAT DATA TO SELECTION PROCESS
                var eventsWithTei: any[] = []
                response.results.instances.map((event: any) => {
                  const currentEnrollmentMarkEvent =
                    marskEvents.results.instances.filter(
                      (markEvent: any) =>
                        markEvent.enrollment === event.enrollment
                    )[0]
                  eventsWithTei.push({
                    ...currentEnrollmentMarkEvent,
                    tei: teiResponse?.results?.instances.find(
                      (tei: { trackedEntity: string }) =>
                        tei.trackedEntity === event.trackedEntity
                    )
                  })
                })

                setSelected(
                  clearSelection
                    ? {
                        rows: eventsWithTei,
                        selectedRows: [],
                        isAllRowsSelected: false
                      }
                    : { ...selected, rows: eventsWithTei }
                )
                setTableData(localData)
                setLoading(false)
              })
              .catch((error) => {
                setLoading(false)
                show({
                  message: `${"Could not get data"}: ${error.message}`,
                  type: { critical: true }
                })
                setTimeout(hide, 5000)
              })) as unknown as TeiQueryResults)
          : ({ results: { instances: [] } } as unknown as TeiQueryResults)

        if (allTeis?.length === 0) {
          setLoading(false)
          setTableData([])
        }
      })
      .catch((error) => {
        setLoading(false)
        show({
          message: `${"Could not get data"}: ${error.message}`,
          type: { critical: true }
        })
        setTimeout(hide, 5000)
      })) as unknown as EventQueryResults
  }

  return {
    getData,
    tableData
  }
}
