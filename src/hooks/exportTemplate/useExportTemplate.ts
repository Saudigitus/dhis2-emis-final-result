import { useSearchParams } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { Attribute } from "../../types/generated/models"
import type { useExportTemplateProps } from "../../types/modal/ModalProps"
import { convertNumberToLetter } from "../../utils/commons/convertNumberToLetter"
import {
  cellBorders,
  cellFillBg
} from "../../utils/constants/exportTemplate/templateStyles"
import { useShowAlerts } from "../commons/useShowAlert"
import { validationSheetConstructor } from "./validationSheetConstructor"
import { ProgressState } from "../../schema/linearProgress"
import { format } from "date-fns"

export enum SectionVariablesTypes {
  EnrollmentDetails = "Enrollment Details",
  Profile = "Student Profile",
  FinalResults = "Final Results"
}

export default function useExportTemplate() {
  const { hide, show } = useShowAlerts()
  const updateProgress = useSetRecoilState(ProgressState)

  async function handleExportToWord(values: useExportTemplateProps, localData: any, headers: any, datas: any, currentProgram: any) {
    try {
      values.setLoadingExport && values.setLoadingExport(true)

      const workbook = new window.ExcelJS.Workbook()
      const dataSheet = workbook.addWorksheet("Data")
      const metaDataSheet = workbook.addWorksheet("Metadata")
      const validationSheet = workbook.addWorksheet("Validation", {
        state: "veryHidden"
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
          options: headers[i].optionSetValue
            ? headers[i].options
              ?.map(
                (op: { code: string; displayName: string }) =>
                  op.code || op.displayName
              )
              ?.join(",")
            : "",
          programId: i === 0 ? currentProgram?.program?.id : "",
          programName: i === 0 ? currentProgram?.program?.displayName : "",
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

            if (currentCell && headers[j]?.optionSetValue) {
              // Get the column letter from the number
              const columnLetter = convertNumberToLetter(
                validationSheet.getColumn(headers[j].optionSetId).number
              )

              // Formula composition for dataValidation
              const formula = `'${validationSheet.name
                }'!$${columnLetter}$2:$${columnLetter}$${headers[j].options.length + 1
                }`

              currentCell.dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [formula]
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

      await workbook.xlsx.writeBuffer().then((buffer: any) => {
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
