import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { useRecoilState, useRecoilValue } from "recoil";
import { useQueryParams, useShowAlerts } from "../../hooks";
import { HeaderFieldsState } from "../../schema/headersSchema";
import { RowSelectionState } from "../../schema/tableSelectedRowsSchema";
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey";
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows";
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys";
import { EventQueryProps, EventQueryResults, MarksQueryResults, TableDataProps, TeiQueryProps, TeiQueryResults } from "../../types/table/TableData";
import { ProgramConfigState } from "../../schema/programSchema";

const EVENT_QUERY = ({ ouMode, page, pageSize, program, order, programStage, filter, orgUnit, filterAttributes, trackedEntity }: EventQueryProps) => ({
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

const TEI_QUERY = ({ ouMode, pageSize, program, trackedEntity, orgUnit, order, programStatus }: TeiQueryProps) => ({
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
            fields: "trackedEntity,trackedEntityType,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,orgUnit,program,trackedEntity]"
        }
    }
})

export function useTableData() {
    const engine = useDataEngine();
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const programConfig = useRecoilValue(ProgramConfigState)
    const { getDataStoreData } = getSelectedKey();
    const { urlParamiters } = useQueryParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    const { hide, show } = useShowAlerts()
    const { program, registration } = getDataStoreKeys()
    const school = urlParamiters().school as unknown as string
    const [selected, setSelected] = useRecoilState(RowSelectionState);

    async function getData(page: number, pageSize: number, clearSelection: boolean) {
        setLoading(true)
        const events: EventQueryResults = await engine.query(EVENT_QUERY({
            ouMode: "SELECTED",
            page,
            pageSize,
            program: program as unknown as string,
            order: "createdAt:desc",
            programStage: registration?.programStage as unknown as string,
            filter: headerFieldsState?.dataElements,
            filterAttributes: headerFieldsState?.attributes,
            orgUnit: school
        })).catch((error) => {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        }) as unknown as EventQueryResults

        const allTeis = events?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity)
        const trackedEntityToFetch = events?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity).toString().replaceAll(",", ";")

        const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
            ? await engine.query(TEI_QUERY({
                // ouMode: "SELECTED",
                // order: "created:desc",
                // pageSize,
                program: program as unknown as string,
                // programStatus: "ACTIVE",
                // orgUnit: school,
                trackedEntity: trackedEntityToFetch
            })).catch((error) => {
                show({
                    message: `${("Could not get data")}: ${error.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            }) as unknown as TeiQueryResults
            : { results: { instances: [] } } as unknown as TeiQueryResults

        const marskEvents: MarksQueryResults = {
            results: {
                instances: [] as unknown as []
            }
        }

        for (const tei of allTeis) {
            const marksResults: MarksQueryResults = await engine.query(EVENT_QUERY({
                ouMode: "SELECTED",
                program: program as unknown as string,
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
            }) as unknown as MarksQueryResults
            marskEvents.results.instances.push(...marksResults?.results?.instances)
        }


        const localData = formatResponseRows({
            eventsInstances: events?.results?.instances,
            teiInstances: teiResults?.results?.instances,
            marksInstances: marskEvents?.results?.instances,
            programConfig: programConfig,
            programStageId: getDataStoreData["final-result"].programStage
        })

        var eventsWithTei: any[] = []
        events.results.instances.map((event: any) => {
            const currentEnrollmentMarkEvent = marskEvents.results.instances.filter((markEvent: any) => markEvent.enrollment === event.enrollment)[0]
            eventsWithTei.push({
                ...currentEnrollmentMarkEvent,
                tei: teiResults?.results?.instances.find((tei: { trackedEntity: string }) => tei.trackedEntity === event.trackedEntity)
            });
        });

        setSelected(clearSelection ? { rows: eventsWithTei, selectedRows: [], isAllRowsSelected: false } : { ...selected, rows: eventsWithTei })
        setTableData(localData);
        setLoading(false)
    }

    return {
        getData,
        tableData,
        loading,
    }
}
