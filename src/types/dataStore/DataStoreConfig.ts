interface attendance {
  absenceReason: string
  programStage: string
  status: string
  statusOptions: [
    {
      code: string
      icon: string
    }
  ]
}
interface simpleProgramStage {
  programStage: string
}
interface performance {
  programStages: simpleProgramStage[]
}
interface registration {
  academicYear: string
  grade: string
  programStage: string
  section: string
}
interface transfer {
  destinySchool: string
  programStage: string
  status: string
}

interface finalResult extends simpleProgramStage {
  status: string
}

interface defaults {
  currentAcademicYear: string
  allowSearching: boolean
  defaultOrder: string
}

interface filterItem {
  code: string
  dataElement: string
  order: number
}

interface filterDataElements {
  code: string
  order: number
  dataElement: string
}
interface filters {
  dataElements: filterDataElements[]
}

interface dataStoreRecord {
  attendance: attendance
  key: string
  trackedEntityType: string
  lastUpdate: string
  performance: performance
  program: string
  filters: filters
  registration: registration
  ["socio-economics"]: simpleProgramStage
  transfer: transfer
  ["final-result"]: finalResult
  defaults: defaults
}

interface dataStoreRecordStaffFormConfig {
  formShownVaribles: string[]
}

export type {
  filterItem,
  dataStoreRecord,
  transfer,
  registration,
  performance,
  attendance,
  simpleProgramStage,
  filters,
  filterDataElements,
  dataStoreRecordStaffFormConfig
}
