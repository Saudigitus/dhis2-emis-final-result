/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import useShowAlerts from "../commons/useShowAlert";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";
// import { type TableDataProps, type EventQueryProps, type TeiQueryProps, type MarksQueryResults, type EventQueryResults, type TeiQueryResults } from "../../types/table/TableData";
import { EventsState } from "../../schema/termMarksSchema";
import { EventQueryProps, EventQueryResults, MarksQueryResults, TableDataProps, TeiQueryProps, TeiQueryResults } from "../../types/table/TableData";
import { RowSelectionState } from "../../schema/tableSelectedRowsSchema";

const EVENT_QUERY = ({ ouMode, page, pageSize, program, order, programStage, filter, orgUnit, filterAttributes, trackedEntity, programStatus }: EventQueryProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            order,
            page,
            pageSize,
            ouMode,
            program,
            programStatus,
            programStage,
            orgUnit,
            filter,
            trackedEntity,
            filterAttributes,
            fields: "*"
        }
    }
})

const TEI_QUERY = ({ ouMode, pageSize, program, trackedEntity, orgUnit, order }: TeiQueryProps) => ({
    results: {
        resource: "tracker/trackedEntities",
        params: {
            program,
            order,
            ouMode,
            pageSize,
            trackedEntity,
            orgUnit,
            fields: "trackedEntity,trackedEntityType,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,status,orgUnit,enrolledAt,program,trackedEntity]"
        }
    }
})

export function useTableData() {
    const engine = useDataEngine();
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { urlParamiters } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    const { hide, show } = useShowAlerts()
    const { getDataStoreData } = getSelectedKey()
    const school = urlParamiters().school as unknown as string
    const [selected, setSelected] = useRecoilState(RowSelectionState);


    async function getData(page: number, pageSize: number) {
        setLoading(true)
        const events: EventQueryResults = await engine.query(EVENT_QUERY({
            ouMode: "SELECTED",
            page,
            pageSize,
            programStatus: "ACTIVE",
            program: getDataStoreData?.program,
            order: "createdAt:desc",
            programStage: getDataStoreData?.registration?.programStage,
            filter: headerFieldsState?.dataElements,
            filterAttributes: headerFieldsState?.attributes,
            orgUnit: school
        })).catch((error) => {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        })

        const allTeis = events?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity)
        const trackedEntityToFetch = events?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity).toString().replaceAll(",", ";")

        const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
            ? await engine.query(TEI_QUERY({
                ouMode: "SELECTED",
                order: "created:desc",
                pageSize,
                program: getDataStoreData?.program,
                orgUnit: school,
                trackedEntity: trackedEntityToFetch
            })).catch((error) => {
                show({
                    message: `${("Could not get data")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            })
            : { results: { instances: [] } }

        const marskEvents: MarksQueryResults = {
            results: {
                instances: []
            }
        }

        for (const tei of allTeis) {
            const marksResults: MarksQueryResults = await engine.query(EVENT_QUERY({
                ouMode: "SELECTED",
                programStatus: "ACTIVE",
                program: getDataStoreData?.program,
                order: "createdAt:desc",
                programStage: getDataStoreData?.["final-result"].programStage,
                orgUnit: school,
                trackedEntity: tei
            })).catch((error) => {
                show({
                    message: `${("Could not get data")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            })
            marskEvents.results.instances.push(...marksResults?.results?.instances)
        }


        const localData = formatResponseRows({
            eventsInstances: events?.results?.instances,
            teiInstances: teiResults?.results?.instances,
            marksInstances: marskEvents?.results?.instances,
        })


        const eventsWithTei = marskEvents.results.instances.map((event: any) => (
            {
                ...event,
                tei: teiResults?.results?.instances.find((tei: { trackedEntity: string }) => tei.trackedEntity === event.trackedEntity)
            }
        ));


        setSelected({ ...selected, rows: eventsWithTei })

        setTableData(localData);
        setLoading(false)
    }

    return {
        getData,
        tableData,
        loading,
    }
}