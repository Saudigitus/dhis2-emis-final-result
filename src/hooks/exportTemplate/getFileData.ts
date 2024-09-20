import { useDataEngine } from "@dhis2/app-runtime"
import { EventQueryProps } from "../../types/api/WithoutRegistrationTypes"
import { TeiQueryProps } from "../../types/api/WithRegistrationTypes"
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys"
import { useQueryParams } from "../commons/useQueryParams"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows"
import { ProgressState } from "../../schema/linearProgress"
import { ProgramConfigState } from "../../schema/programSchema"
import { HeaderFieldsState } from "../../schema/headersSchema"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"
import { useGenerateInfo } from "./generateInformations"

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

export function useGetFileData() {
    const engine = useDataEngine()
    const { program, registration } = getDataStoreKeys()
    const { urlParamiters } = useQueryParams()
    const programConfig = useRecoilValue(ProgramConfigState)
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const school = urlParamiters().school as unknown as string
    const updateProgress = useSetRecoilState(ProgressState)
    const { getDataStoreData: programConfigDataStore } = getSelectedKey()
    const { generateInformations } = useGenerateInfo()

    async function getData() {

        const {
            results: { instances: eventsInstances }
        } = await engine.query(
            EVENT_QUERY({
                ouMode: "SELECTED",
                paging: false,
                program: program as unknown as string,
                order: "createdAt:desc",
                programStage: registration?.programStage as unknown as string,
                filter: headerFieldsState?.dataElements,
                filterAttributes: headerFieldsState?.attributes,
                orgUnit: school
            })
        )
        updateProgress({ stage: 'export', progress: 10, buffer: 15 })

        const allTeis: [] = eventsInstances.map(
            (x: { trackedEntity: string }) => x.trackedEntity
        )

        updateProgress({ stage: 'export', progress: 40, buffer: 45 })

        const {
            results: { instances: teiInstances }
        } = await engine.query(
            TEI_QUERY({
                program: program as unknown as string,
                trackedEntity: allTeis.join(";")
            } as unknown as any)
        )

        let marksInstances: any[] = []

        for (const tei of allTeis) {
            const {
                results: { instances: marksData }
            } = await engine.query(
                EVENT_QUERY({
                    program: program as unknown as string,
                    order: "createdAt:desc",
                    programStage: programConfigDataStore["final-result"].programStage,
                    trackedEntity: tei
                } as unknown as any)
            )

            updateProgress((progress: any) => ({ stage: 'export', progress: progress.progress + 50 / allTeis.length, buffer: progress.buffer + 55 / allTeis.length }))
            marksInstances = marksInstances.concat(marksData)
        }

        const localData = formatResponseRows({
            eventsInstances,
            teiInstances,
            marksInstances,
            programConfig: programConfig,
            programStageId: programConfigDataStore["final-result"].programStage
        })

        return localData
    }

    return { getData }
}