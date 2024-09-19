import React from "react";
import { ButtonStrip } from "@dhis2/ui";
import SummaryCard from "../card/SummaryCard";
import {useRecoilValue} from "recoil";
import { type BulkImportResponseStats, BulkImportResponseStatsState, ProcessingRecords, ProcessingRecordsState, ProcessingStage } from "../../schema/bulkImportSchema";

interface SummaryCardsProps {
    created: number
    updated: number
    conflicts: number
    duplicates: number
    invalid: number
}

function SummaryCards(values: SummaryCardsProps): React.ReactElement {
    const { updated } = values;
    const processingStage: string = useRecoilValue<string>(ProcessingStage)
    const processedRecords: ProcessingRecords = useRecoilValue<ProcessingRecords>(ProcessingRecordsState)
    const bulkImportResponseStats: BulkImportResponseStats = useRecoilValue<BulkImportResponseStats>(BulkImportResponseStatsState)
    return processingStage === "template-processing"
        ? (
            <ButtonStrip>
                <SummaryCard color="secondary" label={"Updates"} value={updated} />
            </ButtonStrip>)
        : (
            <ButtonStrip>
                <SummaryCard color="blue500" label="Updated" value={bulkImportResponseStats.stats.updated} />
                <SummaryCard color="error" label="Ignored" value={bulkImportResponseStats.stats.ignored} />
            </ButtonStrip>
        )
}

export default SummaryCards;
