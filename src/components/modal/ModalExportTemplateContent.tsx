import React, { useState, useRef } from "react"
import { ModalActions, Button, ButtonStrip, Tag, IconInfo16 } from "@dhis2/ui"
import { Form } from "react-final-form"
import GroupForm from "../form/GroupForm"
import { useQueryParams } from "../../hooks"
import { getDataStoreKeys } from "../../utils/commons/dataStore/getDataStoreKeys"
import { formFields } from "../../utils/constants/exportTemplate/exportEmptyTemplateForm"
import type { ModalExportTemplateProps } from "../../types/modal/ModalProps"
import useGetExportTemplateForm from "../../hooks/form/useGetExportTemplateForm"
import useExportTemplate from "../../hooks/exportTemplate/useExportTemplate"
import { removeFalseKeys } from "../../utils/commons/removeFalseKeys"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { ProgressState } from "../../schema/linearProgress"
import IteractiveProgress from "../progress/interactiveProgress"
import style from '../modal/components/modal.module.css'
import { useGetFileData } from "../../hooks/exportTemplate/getFileData"
import { useGenerateInfo } from "../../hooks/exportTemplate/generateInformations"

const loading = false
function ModalExportTemplateContent(
  props: ModalExportTemplateProps
): React.ReactElement {
  const { setOpen, sectionName } = props
  const { exportFormFields } = useGetExportTemplateForm()
  const { registration } = getDataStoreKeys()

  const { urlParamiters } = useQueryParams()
  const {
    school: orgUnit,
    schoolName: orgUnitName,
    academicYear,
    grade
  } = urlParamiters()
  const formRef: React.MutableRefObject<FormApi<IForm, Partial<IForm>>> =
    useRef(null)

  const [values, setValues] = useState<Record<string, string>>({})
  const [initialValues] = useState<object>({
    orgUnitName,
    [registration?.academicYear]: academicYear,
    [registration?.grade]: grade
  })
  const [loadingExport, setLoadingExport] = useState(false)
  const progress = useRecoilValue(ProgressState)
  const { handleExportToWord } = useExportTemplate()
  const { getData } = useGetFileData()
  const { generateInformations } = useGenerateInfo()
  const updateProgress = useSetRecoilState(ProgressState)

  async function onSubmit() {
    updateProgress({ stage: 'export', progress: 0, buffer: 10 })

    const valores: any = {
      academicYearId: values[registration.academicYear],
      gradeId: values[registration.grade],
      orgUnit: values.orgUnit,
      orgUnitName: values.orgUnitName,
      studentsNumber: values.studentsNumber,
      setLoadingExport
    }

    const localData = await getData()

    const { headers, datas, currentProgram } = await generateInformations({ ...valores, studentsNumber: localData.length })

    await handleExportToWord(valores, localData, headers, datas, currentProgram)

    setOpen(false)
  }

  function onChange(e: any): void {
    setValues(removeFalseKeys(e))
  }

  const modalActions = [
    {
      id: "cancel",
      type: "button",
      label: progress.progress != null ? "Hide" : "Cancel",
      disabled: loading,
      onClick: () => {
        setOpen(false)
      },
    },
    {
      id: "downloadTemplate",
      type: "submit",
      label: "Export",
      primary: true,
      disabled: loadingExport,
      loading: loadingExport,
      className: progress.progress != null && style.remove
    }
  ]

  const Actions = () => {
    return <ModalActions>
      <ButtonStrip end>
        {modalActions.map((action, i) => {
          return (
            <Button key={i} {...action}>
              {action.label}
            </Button>
          )
        })}
      </ButtonStrip>
    </ModalActions>
  }

  return (
    <div>
      {
        progress.progress != null ?
          <>
            <IteractiveProgress />
            <Actions />
          </>
          :
          <>
            <Tag positive icon={<IconInfo16 />} maxWidth="100%">
              This file will allow the import of new {sectionName} data into the
              system. Please respect the blocked fields to avoid conflicts.
            </Tag>

            <Form initialValues={{ ...initialValues, orgUnit }} onSubmit={onSubmit}>
              {({ handleSubmit, values, form }) => {
                formRef.current = form
                return (
                  <form
                    onSubmit={handleSubmit}
                    onChange={onChange(values) as unknown as () => void}
                  >
                    {formFields(exportFormFields, sectionName)?.map(
                      (field: any, index: number) => {
                        return (
                          <GroupForm
                            name={field.section}
                            description={field.description}
                            key={index}
                            fields={field.fields}
                            disabled={false}
                          />
                        )
                      }
                    )}

                    <br />
                    <Actions />
                  </form>
                )
              }}
            </Form>
          </>
      }
    </div>
  )
}

export default ModalExportTemplateContent
