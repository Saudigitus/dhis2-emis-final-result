import { atom } from "recoil"
import { z } from "zod";

const attendance = z.object({
    absenceReason: z.string(),
    programStage: z.string(),
    status: z.string()
})

const programStages = z.object({
    programStage: z.string()
})

const performance = z.object({
    programStages: z.array(programStages)
})

const registration = z.object({
    academicYear: z.string(),
    grade: z.string(),
    programStage: z.string(),
    section: z.string()
})

const finalResult = z.object({
    programStage: z.string(),
    status: z.string()
})

const dataStoreRecord = z.object({
    attendance,
    key: z.string(),
    lastUpdate: z.string(),
    performance,
    program: z.string(),
    registration,
    "socio-economics": programStages,
    "final-result": finalResult
})

export type DataStoreConfig = z.infer<typeof dataStoreRecord>

export const DataStoreState = atom<DataStoreConfig | null>({
    key: "dataStore-get-state",
    default: null
})
