
import { useRecoilState, useRecoilValue } from "recoil";
import { DataStoreState } from "../../schema/dataStoreSchema";
import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime";
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows";
import { useParams } from "../commons/useQueryParams";
import { HeaderFieldsState } from "../../schema/headersSchema";
import useShowAlerts from "../commons/useShowAlert";
import { RowSelectionState } from "../../schema/tableSelectedRowsSchema";

type TableDataProps = Record<string, string>;

interface EventQueryProps {
    page: number
    pageSize: number
    ouMode: string
    program: string
    order: string
    programStatus: string
    programStage: string
    orgUnit: string
    filter?: string[]
    filterAttributes?: string[]
}

interface TeiQueryProps {
    program: string
    pageSize: number
    ouMode: string
    trackedEntity: string
    orgUnit: string
    order: string
}

const EVENT_QUERY = ({ ouMode, page, pageSize, program, order, programStage, filter, orgUnit, filterAttributes, programStatus }: EventQueryProps) => ({
    results: {
        resource: "tracker/events",
        params: {
            order,
            page,
            pageSize,
            programStatus,
            ouMode,
            program,
            programStage,
            orgUnit,
            filter,
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
            fields: "trackedEntity,trackedEntityType,createdAt,orgUnit,attributes[attribute,value],enrollments[createdAt,createdBy,deleted,enrolledAt,enrollment,followUp,notes,occurredAt,orgUnit,orgUnitName,program,status,trackedEntity,updatedAt,updatedBy]"
        }
    }
})

interface dataValuesProps {
    dataElement: string
    value: string
}

interface attributesProps {
    attribute: string
    value: string
}

interface EventQueryResults {
    results: {
        instances: [{
            trackedEntity: string
            dataValues: dataValuesProps[]
        }]
    }
}

interface TeiQueryResults {
    results: {
        instances: [{
            trackedEntity: string
            attributes: attributesProps[]
        }]
    }
}

export function useTableData() {
    const engine = useDataEngine();
    const dataStoreState = useRecoilValue(DataStoreState);
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const { urlParamiters } = useParams()
    const [loading, setLoading] = useState<boolean>(false)
    const [tableData, setTableData] = useState<TableDataProps[]>([])
    const { hide, show } = useShowAlerts()
    const school = urlParamiters().school as unknown as string
    const [selected, setSelected] = useRecoilState(RowSelectionState);

    async function getData(page: number, pageSize: number) {
        setLoading(true)

        const eventsResults: EventQueryResults = await engine.query(EVENT_QUERY({
            ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
            page,
            pageSize,
            program: dataStoreState?.program as unknown as string,
            order: "createdAt:desc",
            programStage: dataStoreState?.registration?.programStage as unknown as string,
            filter: headerFieldsState?.dataElements,
            programStatus: "ACTIVE",
            filterAttributes: headerFieldsState?.attributes,
            orgUnit: school
        })).catch((error) => {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        })

        const trackedEntityToFetch = eventsResults?.results?.instances.map((x: { trackedEntity: string }) => x.trackedEntity).toString().replaceAll(",", ";")

        const finalResultEventsResult: EventQueryResults = await engine.query(EVENT_QUERY({
            ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
            page,
            pageSize,
            program: dataStoreState?.program as unknown as string,
            order: "createdAt:desc",
            programStatus: "ACTIVE",
            programStage: dataStoreState?.["final-result"]?.programStage as unknown as string,
            orgUnit: school
        })).catch((error) => {
            show({
                message: `${("Could not get data")}: ${error.message}`,
                type: { critical: true }
            });
            setTimeout(hide, 5000);
        })

        const finalResultFirlteredEvents = finalResultEventsResult?.results.instances.filter(event => {
            return eventsResults?.results.instances.some(item => item.trackedEntity === event.trackedEntity);
        });

        const teiResults: TeiQueryResults = trackedEntityToFetch?.length > 0
            ? await engine.query(TEI_QUERY({
                ouMode: school != null ? "SELECTED" : "ACCESSIBLE",
                order: "created:desc",
                pageSize,
                program: dataStoreState?.program as unknown as string,
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

        const eventsWithTei = finalResultFirlteredEvents.map(event => (
            {
                ...event,
                tei: teiResults?.results?.instances.find((tei: { trackedEntity: string }) => tei.trackedEntity === event.trackedEntity)
            }
        ));

        setSelected({ ...selected, rows: eventsWithTei })
        setTableData(formatResponseRows({
            eventsInstances: eventsWithTei,
            teiInstances: teiResults?.results?.instances
        }));

        setLoading(false)
    }

    return {
        getData,
        tableData,
        loading
    }
}
