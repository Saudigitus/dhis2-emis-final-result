import { useDataEngine, useDataQuery } from "@dhis2/app-runtime"
import { format } from "date-fns"
import { useSearchParams } from "react-router-dom"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { HeaderFieldsState } from "../../schema/headersSchema"
import { ProgramConfigState } from "../../schema/programSchema"
import type { EventQueryProps } from "../../types/api/WithoutRegistrationTypes"
import type { TeiQueryProps } from "../../types/api/WithRegistrationTypes"
import { Attribute } from "../../types/generated/models"
import type { useExportTemplateProps } from "../../types/modal/ModalProps"
import { VariablesTypes } from "../../types/variables/AttributeColumns"
import { convertNumberToLetter } from "../../utils/commons/convertNumberToLetter"
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys"
import { getSelectedKey } from "../../utils/commons/dataStore/getSelectedKey"
import { capitalizeString } from "../../utils/commons/formatCamelCaseToWords"
import {
  cellBorders,
  cellFillBg
} from "../../utils/constants/exportTemplate/templateStyles"
import { formatResponseRows } from "../../utils/table/rows/formatResponseRows"
import { useQueryParams } from "../commons/useQueryParams"
import { useShowAlerts } from "../commons/useShowAlert"
import { validationSheetConstructor } from "./validationSheetConstructor"
import { ProgressState } from "../../schema/linearProgress"

export enum SectionVariablesTypes {
  EnrollmentDetails = "Enrollment Details",
  Profile = "Student Profile",
  FinalResults = "Final Results"
}

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

export default function useExportTemplate() {
  const engine = useDataEngine()
  const { program, registration } = getDataStoreKeys()
  const { urlParamiters } = useQueryParams()
  const programConfig = useRecoilValue(ProgramConfigState)
  const headerFieldsState = useRecoilValue(HeaderFieldsState)
  const school = urlParamiters().school as unknown as string
  const [searchParams, _] = useSearchParams()
  const { hide, show } = useShowAlerts()
  const updateProgress = useSetRecoilState(ProgressState)
  const programConfigState = useRecoilValue(ProgramConfigState);

  const { getDataStoreData: programConfigDataStore } = getSelectedKey()

  async function generateInformations(inputValues: useExportTemplateProps) {
    const currentAttributes =
      programConfigState?.programTrackedEntityAttributes?.filter(x => x.displayInList)?.map(
        (p: { mandatory: boolean; trackedEntityAttribute: any }) => {
          return { mandatory: p.mandatory, ...p.trackedEntityAttribute }
        }
      ) || []

    let newHeaders: any = []
    const newDataList: any = []

    if (currentAttributes.length > 0) {
      newHeaders = currentAttributes.map((attribute: any) => ({
        key: attribute.id,
        id: attribute.id,
        unique: attribute.unique || false,
        generated: attribute.generated || false,
        valueType: attribute.valueType,
        label: attribute.displayName,
        optionSetValue: attribute.optionSetValue || false,
        options: attribute.optionSet?.options || [],
        optionSetId: attribute.optionSet?.id || null,
        required: attribute.mandatory || false,
        metadataType: VariablesTypes.Attribute,
        sectionDataType: SectionVariablesTypes.Profile
      }))
    }

    const reserveValuePayload: any = {}

    const registrationProgramStageDataElements =
      programConfigState?.programStages?.reduce(
        (prev: any, curr: any) => {
          if (curr.id === registration.programStage) {
            const newDataElements =
              curr.programStageDataElements?.reduce(
                (dxPrev: any, dxCurr: any) => {
                  dxPrev.push({
                    key: `${registration.programStage}.${dxCurr.dataElement?.id}`,
                    id: `${registration?.programStage}.${dxCurr.dataElement?.id}`,
                    label: dxCurr.dataElement?.displayName,
                    valueType: dxCurr.dataElement?.valueType,
                    optionSetValue: dxCurr.dataElement?.optionSetValue || false,
                    options: dxCurr.dataElement?.optionSet?.options || [],
                    optionSetId: dxCurr.dataElement?.optionSet?.id || null,
                    required: dxCurr?.compulsory || false,
                    metadataType: VariablesTypes.DataElement,
                    sectionDataType: SectionVariablesTypes.EnrollmentDetails
                  })
                  return dxPrev
                },
                []
              ) || []

            prev = [...prev, ...newDataElements]
            return prev
          }

          return prev
        },
        []
      ) || []

    const finalResultsProgramStageDataElements =
      programConfigState?.programStages?.reduce(
        (prev: any, curr: any) => {
          if (
            curr.id === programConfigDataStore?.["final-result"]?.programStage
          ) {
            const newDataElements =
              curr.programStageDataElements?.reduce(
                (dxPrev: any, dxCurr: any) => {
                  dxPrev.push({
                    key: `${programConfigDataStore?.["final-result"]?.programStage}.${dxCurr.dataElement?.id}`,
                    id: `${programConfigDataStore?.["final-result"]?.programStage}.${dxCurr.dataElement?.id}`,
                    label: dxCurr.dataElement?.displayName,
                    valueType: dxCurr.dataElement?.valueType,
                    optionSetValue: dxCurr.dataElement?.optionSetValue || false,
                    options: dxCurr.dataElement?.optionSet?.options || [],
                    optionSetId: dxCurr.dataElement?.optionSet?.id || null,
                    required: dxCurr?.compulsory || false,
                    metadataType: VariablesTypes.DataElement,
                    sectionDataType: SectionVariablesTypes.FinalResults
                  })
                  return dxPrev
                },
                []
              ) || []
            prev = [...prev, ...newDataElements]
            return prev
          }
          return prev
        },
        []
      ) || []

    const newBeginHeaders = [
      {
        key: `ref`,
        id: `ref`,
        label: "Ref",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: false
      },
      {
        key: `orgUnitName`,
        id: `orgUnitName`,
        label: "School Name",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `orgUnit`,
        id: `orgUnit`,
        label: "School UID",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `trackedEntity`,
        id: `trackedEntity`,
        label: "Tracked Entity",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `enrollmentDate`,
        id: `enrollmentDate`,
        label: "Enrollment date",
        valueType: "DATE",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `enrollment`,
        id: `enrollment`,
        label: "Enrollment",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `event`,
        id: `event`,
        label: "Event",
        valueType: "TEXT",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      },
      {
        key: `occurredAt`,
        id: `occurredAt`,
        label: "Event Date",
        valueType: "DATE",
        optionSetValue: false,
        options: [],
        optionSetId: null,
        required: true
      }
    ]

    const newBeginHeadersFormatted = newBeginHeaders.map((header) => {
      return {
        ...header,
        metadataType: VariablesTypes.Default,
        sectionDataType: SectionVariablesTypes.EnrollmentDetails
      }
    })

    newHeaders = [
      ...newBeginHeadersFormatted,
      ...newHeaders,
      ...registrationProgramStageDataElements,
      ...finalResultsProgramStageDataElements
    ]

    if (+inputValues.studentsNumber > 0) {
      for (let i = 0; i < +inputValues.studentsNumber; i++) {
        const payload: any = {}
        let incrementHeader = 0
        for (let newHeader of newHeaders) {
          let value = ""
          if (incrementHeader === 0) value = `${i + 1}`
          if (incrementHeader === 1) value = `${inputValues.orgUnitName}`
          if (incrementHeader === 2) value = `${inputValues.orgUnit}`
          if (incrementHeader === 3)
            value = `${format(
              new Date(),
              `${inputValues.academicYearId}-MM-dd`
            )}`
          if (incrementHeader === 4) value = `${inputValues.academicYearId}`

          if (incrementHeader > 3) {
            const found_reserv = reserveValuePayload[newHeader.id]
            if (found_reserv) {
              value = found_reserv[0].value
              reserveValuePayload[newHeader.id] = reserveValuePayload[
                newHeader.id
              ].filter((resVam: { value: any }) => value !== resVam.value)
            }
          }

          payload[`${newHeader.id}`] = {
            label: newHeader.label,
            value
          }
          incrementHeader++
        }

        newDataList.push(payload)
      }
    }

    return {
      headers: newHeaders || [],
      datas: newDataList || [],
      currentProgram: programConfigState
    }
  }

  async function handleExportToWord(values: useExportTemplateProps) {
    try {
      updateProgress({ stage: 'export', progress: 0, buffer: 10 })
      values.setLoadingExport && values.setLoadingExport(true)

      const {
        results: { instances: eventsInstances }
      } = await engine.query(
        EVENT_QUERY({
          ouMode: "SELECTED",
          paging: false,
          program: program as unknown as string,
          order: programConfigDataStore.defaults.defaultOrder || "occurredAt:desc",
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
        })
      )

      let marksInstances: any[] = []

      for (const tei of allTeis) {
        const {
          results: { instances: marksData }
        } = await engine.query(
          EVENT_QUERY({
            program: program as unknown as string,
            order: programConfigDataStore.defaults.defaultOrder || "occurredAt:desc",
            programStage: programConfigDataStore["final-result"].programStage,
            trackedEntity: tei
          })
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
      const workbook = new window.ExcelJS.Workbook()
      const dataSheet = workbook.addWorksheet("Data")
      const metaDataSheet = workbook.addWorksheet("Metadata")
      const validationSheet = workbook.addWorksheet("Validation", {
        state: "veryHidden"
      })
      const { headers, datas, currentProgram } = await generateInformations({
        ...values,
        studentsNumber: localData.length
      })

      // Generating validation data
      validationSheetConstructor(validationSheet, headers)

      // Set columns for Metadata sheet
      metaDataSheet.columns = [
        {
          header: "programId",
          key: "programId",
          width: 20
        },

        {
          header: "programName",
          key: "programName",
          width: 20
        },
        {
          header: "",
          key: "none",
          width: 20
        },
        {
          header: "id",
          key: "id",
          width: 20
        },
        {
          header: "name",
          key: "name",
          width: 30
        },

        {
          header: "valueType",
          key: "valueType",
          width: 30
        },

        {
          header: "options",
          key: "options",
          width: 50
        }
      ]

      // Add data to Metadata sheet
      for (let i = 0; i < headers.length; i++) {
        metaDataSheet.addRow({
          id: headers[i].id,
          name: headers[i].label,
          valueType: headers[i].valueType,
          options: headers[i].options
            ? headers[i].options
              ?.map(
                (op: { value: string; label: string }) =>
                  op.value || op.label
              )
              ?.join(",")
            : "",
          programId: i === 0 ? currentProgram?.id : "",
          programName: i === 0 ? currentProgram?.displayName : "",
          none: ""
        })
      }

      // Add headers to the data sheet
      dataSheet.columns = headers.map((header: any, index: number) => ({
        header: `${header.label} ${header.required ? "*" : ""}`,
        key: `${header.id}`,
        width: index === 0 ? 20 : 30,
        style: {
          font: { bold: true }
        }
      }))
      dataSheet.addRow(
        headers.reduce((prev: any, curr: any) => {
          prev[curr.id] = `${curr.label} ${curr.required ? "*" : ""}`
          return prev
        }, {})
      )

      // Create Sections for colSpan
      const sections: any = {
        [SectionVariablesTypes.EnrollmentDetails]: [],
        [SectionVariablesTypes.Profile]: [],
        [SectionVariablesTypes.FinalResults]: []
      }

      headers.forEach((header: any) => {
        sections[header.sectionDataType].push(header.id)
      })

      // Add the sections row above the headers row
      let colIndex = 1
      for (const section in sections) {
        if (sections[section].length > 0) {
          dataSheet.mergeCells(
            1,
            colIndex,
            1,
            colIndex + sections[section].length - 1
          )
          dataSheet.getCell(1, colIndex).alignment = {
            horizontal: "center",
            vertical: "middle"
          }
          dataSheet.getCell(1, colIndex).value = section
          colIndex += sections[section].length
        }
      }

      // Add background in the sections row
      const firstRow = dataSheet.getRow(1)
      headers.forEach((header: any, index: any) => {
        const cell = firstRow.getCell(index + 1)
        cell.fill = cellFillBg(header.sectionDataType)
        cell.border = cellBorders
        cell.font = { bold: true }
      })

      // Add background in the headers row
      const secondRow = dataSheet.getRow(2)
      headers.forEach((header: any, index: any) => {
        const cell = secondRow.getCell(index + 1)
        cell.fill = cellFillBg(header.metadataType)
        cell.border = cellBorders
        cell.font = { bold: true }

        // Hide the orgUnit ID column
        if (header.id === "orgUnit") {
          dataSheet.getColumn(index + 1).hidden = true
        }
        // Hide the Event ID column
        if (header.id === "event") {
          dataSheet.getColumn(index + 1).hidden = true
        }
        // Hide the enrollment ID column
        if (header.id === "enrollment") {
          dataSheet.getColumn(index + 1).hidden = true
        }
        // Hide the trackedEntity ID column
        if (header.id === "trackedEntity") {
          dataSheet.getColumn(index + 1).hidden = true
        }
      })

      // Add second header row
      const headerRow = dataSheet.addRow(
        headers.reduce((prev: any, curr: any) => {
          prev[curr.id] = curr.id
          return prev
        }, {})
      )

      // Add background in the header row
      headers.forEach((header: any, index: any) => {
        const cell = headerRow.getCell(index + 1)
        cell.fill = cellFillBg(header.metadataType)
        cell.border = cellBorders
        cell.font = { bold: true }
      })

      // Hide the header IDs row
      headerRow.hidden = true

      // Add data rows
      let index = 0
      for (let data of datas) {
        const rowData = localData[index]
        const row = dataSheet.addRow(
          headers.map((curr: any) => {
            const allIds = String(curr.id).split(".")
            const id = allIds[allIds.length - 1]
            if (rowData[id] && typeof rowData[id] === "object") {
              return rowData[`${id}-val`]
            }

            return rowData[id] ?? data[id]?.value
          })
        )
        index++
        const cell = row.getCell(headers.length)
        cell.protection = { locked: false }
      }
      // Data Validation
      for (let i = 0; i < datas.length; i++) {
        const currentRow = dataSheet.getRow(i + 4)
        if (currentRow) {
          for (let j = 0; j < headers.length; j++) {
            const currentCell = currentRow.getCell(j + 1)

            if (currentCell && headers[j]?.options) {
              const formulae = ['"' + headers[j]?.options?.map((item:any) => item.value)?.join(",") + '"'];

              currentCell.dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [formulae]
              }
            }

            if (currentCell && headers[j]?.valueType === "BOOLEAN") {
              currentCell.dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: ['"true,false"']
              }
            }

            if (
              currentCell &&
              headers[j]?.valueType === Attribute.valueType.TRUE_ONLY
            ) {
              currentCell.dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: ['"true"']
              }
            }
          }
        }
      }

      // Hide empty rows
      const lastFilledRowIndex = dataSheet.actualRowCount
      dataSheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
        const isEmpty = row.values
          .slice(1)
          .every((cell) => cell === null || cell === undefined)
        if (isEmpty) {
          row.hidden = true
        }
      })

      // Protect the data sheet but allow editing of existing cells
      dataSheet.protect("", {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: true,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
        pivotTables: false
      })

      // Set freeze panes for headers
      dataSheet.views = [
        { state: "frozen", ySplit: 1 },
        { state: "frozen", ySplit: 2 }
      ]

      workbook.xlsx.writeBuffer().then((buffer: any) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        })
        window.saveAs(
          blob,
          `SEMIS - Final result - ${format(new Date(), "yyy-mm-dd")}.xlsx`
        )
      })

      show({
        message: "File exported successfully",
        type: { success: true }
      })
      setTimeout(hide, 5000)
      updateProgress({ stage: 'export', progress: 100, buffer: 100 })
      values.setLoadingExport && values.setLoadingExport(false)
    } catch (err: any) {
      updateProgress({ progress: null })
      show({
        message: err.message,
        type: { critical: true }
      })
      setTimeout(hide, 5000)
      values.setLoadingExport && values.setLoadingExport(false)
    }
  }

  return {
    handleExportToWord
  }
}
