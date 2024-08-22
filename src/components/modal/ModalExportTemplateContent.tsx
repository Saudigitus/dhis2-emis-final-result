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
    grade,
    class: currentClass
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

  const { handleExportToWord } = useExportTemplate()

  async function onSubmit() {
    await handleExportToWord({
      academicYearId: values[registration.academicYear],
      gradeId: values[registration.grade],
      orgUnit: values.orgUnit,
      orgUnitName: values.orgUnitName,
      studentsNumber: values.studentsNumber,
      setLoadingExport
    })
    setOpen(false)
  }

  function onChange(e: any): void {
    setValues(removeFalseKeys(e))
  }

  const modalActions = [
    {
      id: "cancel",
      type: "button",
      label: "Cancel",
      disabled: loading,
      onClick: () => {
        setOpen(false)
      }
    },
    {
      id: "downloadTemplate",
      type: "submit",
      label: "Export Students List",
      primary: true,
      disabled: loadingExport,
      loading: loadingExport
    }
  ]

  return (
    <div>
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
              <ModalActions>
                <ButtonStrip end>
                  {modalActions.map((action, i) => {
                    return (
                      <Button
                        key={i}
                        {...action}
                        disabled={
                          action.id === "downloadTemplate" &&
                          (!grade || !currentClass)
                        }
                      >
                        {action.label}
                      </Button>
                    )
                  })}
                </ButtonStrip>
              </ModalActions>
            </form>
          )
        }}
      </Form>
    </div>
  )
}

export default ModalExportTemplateContent
