import React, { useState } from "react"
import { useRecoilState } from "recoil"
import Tooltip from "@material-ui/core/Tooltip"
import { DropzoneDialog } from "material-ui-dropzone"
import { CloudUpload } from "@material-ui/icons"
import SummaryCard from "../../../card/SummaryCard"

// import {
//   Divider,
//   IconCheckmarkCircle16,
//   Tag,
//   ModalActions,
//   Button,
//   ButtonStrip
// } from "@dhis2/ui"

import { useGetEnrollmentForm, useQueryParams } from "../../../../hooks"
import {
  IconAddCircle24,
  Button,
  ButtonStrip,
  ModalActions,
  IconUserGroup16
} from "@dhis2/ui"
import { RowSelectionState } from "../../../../schema/tableSelectedRowsSchema"
import {
  ModalComponent,
  ModalContentComponent,
  ModalContentPromotion,
  ImportContent
} from "../../../../components"
import ModalSummaryContent from "../../../modal/components/SummaryModalContent"
import type { FlyoutOptionsProps } from "../../../../types/Buttons/FlyoutOptionsProps"
import DropdownButtonComponent from "../../../button/DropdownButton"
import styles from "./enrollmentActionsButtons.module.css"
import ModalExportTemplateContent from "../../../modal/ModalExportTemplateContent"
import { getSelectedKey } from "../../../../utils/commons/dataStore/getSelectedKey"
import type { ButtonActionProps } from "../../../../types/Buttons/ButtonActions"
import { useDataEngine } from "@dhis2/app-runtime"

function EnrollmentActionsButtons() {
  const engine = useDataEngine()
  const { getDataStoreData } = getSelectedKey()
  const [open, setOpen] = useState<boolean>(false)
  const [openPromotion, setOpenPromotion] = useState<boolean>(false)
  const [openImport, setOpenImport] = useState<boolean>(false)
  const [openSummary, setOpenSummary] = useState<boolean>(false)
  const [openStudentUpdate, setOpenStudentUpdate] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [summaryData, setSummaryData] = useState<any>({})
  const [foundEvents, setFoundEvents] = useState<any[]>([])
  const [ignoredEvents, setIgnoredEvents] = useState<any[]>([])
  const [loaders, setLoaders] = useState<{
    dryRun: boolean
    importation: boolean
  }>({ dryRun: false, importation: false })
  const { useQuery, urlParamiters } = useQueryParams()
  const { grade, class: currentClass } = urlParamiters()
  const orgUnit = useQuery().get("school")
  const [selected] = useRecoilState(RowSelectionState)
  const { enrollmentsDetailsData } = useGetEnrollmentForm()
  const [openExportEmptyTemplate, setOpenExportEmptyTemplate] =
    useState<boolean>(false)
  const [report, setReport] = useState<{
    created: number
    updated: number
    deleted: number
    ignored: number
  }>({ deleted: 0, ignored: 0, created: 0, updated: 0 })
  const [template, setTemplate] = useState<string>("validation")
  const noFinalResultStudentSelected = selected.selectedRows.filter(
    (selectedRow: any) => !selectedRow?.dataValues?.[0]?.value
  )
  const enrollmentOptions: FlyoutOptionsProps[] = [
    {
      label: "Export students list",
      divider: false,
      onClick: () => {
        setOpenExportEmptyTemplate(() => true)
      }
    },
    {
      label: "Update students",
      divider: false,
      onClick: () => {
        setIsOpen(() => true)
        setFoundEvents(() => [])
        setIgnoredEvents(() => [])
      }
    }
  ]
  const modalActions: ButtonActionProps[] = [
    {
      label: "Dry Run",
      disabled: foundEvents.length === 0 || loaders.importation,
      loading: loaders.dryRun,
      onClick: async (): void => {
        setLoaders(() => ({ dryRun: true, importation: false }))
        const response: any = await engine.mutate({
          resource: "/tracker",
          type: "create",
          data: { events: foundEvents },
          params: {
            async: false,
            importMode: "VALIDATE"
          }
        })
        setReport(() => response.stats)
        setTemplate(() => "report")
        setLoaders(() => ({ dryRun: false, importation: false }))
      }
    },
    {
      label: "Update final decision",
      primary: true,
      disabled: foundEvents.length === 0 || loaders.dryRun,
      loading: loaders.importation,
      onClick: async (): void => {
        setLoaders(() => ({ dryRun: false, importation: true }))
        const response: any = await engine.mutate({
          resource: "/tracker",
          type: "create",
          data: { events: foundEvents },
          params: {
            async: false
          }
        })
        setReport(() => response.stats)
        setTemplate(() => "report")
        setLoaders(() => ({ dryRun: false, importation: false }))
      }
    },
    {
      label: "Close",
      disabled: loaders.dryRun || loaders.importation,
      onClick: () => {
        setOpenStudentUpdate(() => false)
      }
    }
  ]
  const onSave = async (files: File[]): Promise<void> => {
    const arrayBuffer = await files[0].arrayBuffer()
    const excelJS = (window as any).ExcelJS
    const workbook = new excelJS.Workbook()
    await workbook.xlsx.load(arrayBuffer)
    // Assuming you want to read the first sheet

    const worksheet = workbook.getWorksheet(1) // Read the first worksheet
    const jsonData: any[] = []

    // Get column headers from the first row
    const headers: any[] = []
    worksheet.getRow(3).eachCell((cell: any, colNumber: number) => {
      headers[colNumber] = cell.text
    })

    // Loop through all rows and convert to JSON
    worksheet.eachRow((row: any, rowNumber: any) => {
      if (rowNumber === 1) return
      if (rowNumber === 2) return
      if (rowNumber === 3) return

      const rowData: Record<string, any> = {}
      row.eachCell((cell: any, colNumber: number) => {
        rowData[headers[colNumber]] = cell.value
      })

      jsonData.push(rowData)
    })
    const { status, programStage } = getDataStoreData["final-result"]
    const program = getDataStoreData.program

    const dataElements: string[] = [status]

    jsonData.forEach((a) => {
      const { event, orgUnit, occurredAt, enrollment, trackedEntity, ...rest } =
        a
      let currentEvent: Record<string, string> = {
        enrollment,
        trackedEntity,
        orgUnit,
        programStage,
        program,
        occurredAt
      }
      if (event) {
        currentEvent = { ...currentEvent, event }
      }
      const dataValues = dataElements.flatMap((de) => {
        const value: any = rest[`${programStage}.${de}`]
        if (value) {
          return { dataElement: de, value }
        }
        return []
      })
      if (dataValues.length > 0) {
        setFoundEvents((prev) => prev.concat({ ...currentEvent, dataValues }))
      } else {
        setIgnoredEvents((prev) =>
          prev.concat({ ...currentEvent, ignoredEvents })
        )
      }
    })

    setIsOpen(() => false)
    setOpenStudentUpdate(() => true)
  }

  return (
    <div>
      <ButtonStrip>
        <Tooltip
          title={
            orgUnit === null ? "Please select an organisation unit before" : ""
          }
        >
          <span>
            <Button
              disabled={orgUnit == null || selected.selectedRows.length === 0}
              onClick={() => {
                setOpen(true)
              }}
              icon={<IconAddCircle24 />}
            >
              Assign final result
            </Button>
          </span>
        </Tooltip>
        <Tooltip
          title={
            orgUnit === null
              ? "Please select an organisation unit before"
              : noFinalResultStudentSelected.length > 0
              ? "From selected students, some of them don't have final result"
              : ""
          }
        >
          <span>
            <Button
              onClick={() => {
                setOpenPromotion(() => true)
              }}
              disabled={
                selected.selectedRows.length === 0 ||
                noFinalResultStudentSelected.length > 0
              }
              icon={<IconAddCircle24 />}
            >
              Perform promotion
            </Button>
          </span>
        </Tooltip>
        <DropdownButtonComponent
          name={
            (
              <span className={styles.work_buttons_text}>
                Bulk final decision
              </span>
            ) as unknown as string
          }
          // disabled={false}
          disabled={!grade || !currentClass}
          icon={<IconUserGroup16 />}
          options={enrollmentOptions}
        />
      </ButtonStrip>
      {openPromotion && (
        <ModalComponent
          title="Bulk Student Promotion"
          open={openPromotion}
          setOpen={setOpenPromotion}
        >
          <ModalContentPromotion
            enrollmentsDetailsData={enrollmentsDetailsData}
            setSummaryData={setSummaryData}
            setOpenSummary={setOpenSummary}
            setOpen={setOpenPromotion}
          />
        </ModalComponent>
      )}
      {openSummary && (
        <ModalComponent
          title="Students Promotion Summary"
          open={openSummary}
          setOpen={setOpenSummary}
        >
          <ModalSummaryContent
            setOpen={setOpenSummary}
            summaryData={summaryData}
          />
        </ModalComponent>
      )}
      {open && (
        <ModalComponent
          title="Bulk Student Final Result"
          open={open}
          setOpen={setOpen}
        >
          <ModalContentComponent setOpen={setOpen} />
        </ModalComponent>
      )}
      {openImport && (
        <ModalComponent
          title="Import Students"
          open={openImport}
          setOpen={setOpenImport}
        >
          <ImportContent setOpen={setOpen} />
        </ModalComponent>
      )}
      {openExportEmptyTemplate && (
        <ModalComponent
          title={`Data Import Template Export`}
          open={openExportEmptyTemplate}
          setOpen={setOpenExportEmptyTemplate}
        >
          <ModalExportTemplateContent
            sectionName={""}
            setOpen={setOpenExportEmptyTemplate}
          />
        </ModalComponent>
      )}

      <DropzoneDialog
        dialogTitle={"Bulk Final Decision"}
        submitButtonText={"Start Import"}
        dropzoneText={"Drag and drop a file here or Browse"}
        Icon={CloudUpload as any}
        filesLimit={1}
        showPreviews={false}
        showPreviewsInDropzone={true}
        previewGridProps={{
          container: {
            spacing: 1,
            direction: "row"
          }
        }}
        previewText="Selected file:"
        showFileNames={true}
        showFileNamesInPreview={true}
        acceptedFiles={[".xlsx"]}
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        onSave={onSave as any}
        clearOnUnmount={true}
      />

      {openStudentUpdate && (
        <ModalComponent
          title={`Bulk final decision Summary`}
          open={openExportEmptyTemplate}
          setOpen={setOpenStudentUpdate}
        >
          {template === "report" && (
            <ButtonStrip>
              <SummaryCard
                color="primary"
                label="Updated"
                value={report.updated}
              />
              <SummaryCard
                color="error"
                label="Ignored"
                value={report.ignored}
              />
            </ButtonStrip>
          )}
          {template === "validation" && (
            <ButtonStrip>
              <SummaryCard
                color="primary"
                label="Final Decision Updates"
                value={foundEvents.length}
              />
              <SummaryCard
                color="error"
                label="Ignored"
                value={ignoredEvents.length}
              />
            </ButtonStrip>
          )}
          <ModalActions>
            <ButtonStrip end>
              {modalActions.map((action, i) => (
                <Button key={i} {...action}>
                  {action.label}
                </Button>
              ))}
            </ButtonStrip>
          </ModalActions>
        </ModalComponent>
      )}
    </div>
  )
}

export default EnrollmentActionsButtons
