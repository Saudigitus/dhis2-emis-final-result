export type TemplateData = Array<Record<string, any>>
export type PaginationState = Record<string, { page: number, pageSize: number }>;

export interface Stats {
    created: number
    deleted: number
    ignored: number
    total: number
    updated: number
    conflicts?: number
    invalid?: number
}
export interface ApiResponse {
    status: string
    validationReport: ValidationReport
    stats: Stats
    bundleReport?: BundleReport
}

export interface ValidationReport {
    errorReports: any[]
    warningReports: any[]
}
export interface BundleReport {
    status: string
    typeReportMap: TypeReportMap
    stats: Stats
}

interface TypeReportMap {
    TRACKED_ENTITY: TypeReport
    RELATIONSHIP: TypeReport
    EVENT: TypeReport
    ENROLLMENT: TypeReport
}
interface TypeReport {
    trackerType: string
    stats: Stats
    objectReports: ObjectReport[]
}
interface ObjectReport {
    trackerType: string
    uid: string
    index: number
    errorReports: any[]
}