import {atom} from "recoil";
import {type TrackerReport_Stats, type ValidationReport} from "../types/generated";
import { type BundleReport, type Stats, type TemplateData } from "../types/bulkImport/Interfaces";

export interface BulkImportStats {
    events: Stats
}
export const BulkImportStatsState = atom<BulkImportStats>({
    key: "BulkImport-Performance-Stats",
    default: {
        events: {created: 0, deleted: 0, updated: 0, ignored: 0, total: 0, conflicts: 0, invalid: 0}
    }
})

export interface BulkImportResponseStats {
    status: string
    stats: TrackerReport_Stats
    validationReport: ValidationReport
    bundleReport?: BundleReport
}
export const BulkImportResponseStatsState = atom<BulkImportResponseStats>({
    key: "BulkImport-Response-Stats",
    default: {
        status: "PENDING",
        stats: {created: 0, updated: 0, ignored: 0, total: 0, deleted: 0},
        validationReport: {errorReports: [], warningReports: []}
    }
})

export interface ProcessingRecords {
    newRecords?: TemplateData
    validRecords?: TemplateData
    invalidRecords?: TemplateData
    recordsToUpdate: TemplateData
    updateEvents?: Array<Record<string, any>>
}
export const ProcessingRecordsState = atom<ProcessingRecords>({
    key: "processing-records-state",
    default: {
        validRecords: [],
        invalidRecords: [],
        recordsToUpdate: [],
        updateEvents: []
    }
})

export const ProcessingStage = atom<string>({
    key: "bulkimport-processing-stage",
    default: "template-processing"
})

export type Headings = Record<string, string>
export const TemplateHeadingsState = atom<Headings>({
    key: "template-headings",
    default: {}
})