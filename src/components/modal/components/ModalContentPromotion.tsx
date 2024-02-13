import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Form } from "react-final-form";
import { useRecoilState } from "recoil";
import { WithPadding, GroupForm }  from "../../../components";
import { ContentProps } from "../../../types/modal/ModalContentTypes";
import { onSubmitClicked } from "../../../schema/formOnSubmitClicked";
import { RowSelectionState } from "../../../schema/tableSelectedRowsSchema";
import { useQueryParams, useShowAlerts, usePromoteStudent, useGetEnrollmentForm } from "../../../hooks";
import { enrollmentDetailsForm } from "../../../utils/constants/enrollmentForm/enrollmentDetailsForm";
import { ModalActions, Button, ButtonStrip, CircularLoader, CenteredContent, NoticeBox } from "@dhis2/ui";


function ModalContentPromotion({ setOpen }: ContentProps): React.ReactElement {
    const { useQuery } = useQueryParams();
    const formRef: React.MutableRefObject<FormApi<IForm, Partial<IForm>>> = useRef(null);
    const orgUnitName = useQuery().get("schoolName");
    const { enrollmentsDetailsData } = useGetEnrollmentForm();
    const [, setClicked] = useRecoilState<boolean>(onSubmitClicked);
    const [, setValues] = useState<object>({})
    const [fieldsWitValue, setFieldsWitValues] = useState<any[]>([enrollmentsDetailsData])
    const [clickedButton, setClickedButton] = useState<string>("");
    const [selected] = useRecoilState(RowSelectionState);
    const { promoteStudents, mutateState } = usePromoteStudent();
    const { hide, show } = useShowAlerts()
    const [initialValues] = useState<object>({
        registerschoolstaticform: orgUnitName,
        eventdatestaticform: format(new Date(), "yyyy-MM-dd")
    })

    useEffect(() => { setClicked(false) }, [])

    function onSubmit() {
        const allFields = fieldsWitValue.flat()
        if (allFields.filter((element: any) => (element?.assignedValue === undefined && element.required)).length === 0) {
            // FILTER ALL SELECTED ROWS TEI
            const trackedEntities = selected.rows.map((row: any) => row.tei).filter(tei => {
                return selected.selectedRows.some(event => tei?.trackedEntity === event?.trackedEntity);
            })

            void promoteStudents(trackedEntities, fieldsWitValue)
                .then(() => {
                    setOpen(false)
                })
        }
    }

    const modalActions = [
        { id: "cancel", type: "button", label: "Cancel", disabled: mutateState.loading, onClick: () => { setClickedButton("cancel"); setOpen(false) } },
        { id: "saveandcontinue", type: "submit", label: "Perform promotion", primary: true, disabled: mutateState.loading, loading: mutateState.loading, onClick: () => { setClickedButton("saveandcontinue"); setClicked(true) } }
    ];

    if(mutateState.error){
        show({ message: "An unknown error occurred while promoting the student", type: { critical: true } })
    }

    if (enrollmentsDetailsData.length < 1) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    function onChange(e: any): void {
        const sections = enrollmentsDetailsData;
        for (const [key, value] of Object.entries(e)) {
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].find((element: any) => element.id === key) !== null && sections[i].find((element: any) => element.id === key) !== undefined) {
                    // Sending onChanging form value to variables object
                    sections[i].find((element: any) => element.id === key).assignedValue = value
                }
            }
        }
        setFieldsWitValues(sections)
        setValues(e)
    }

    return (
        <WithPadding>
            <React.Fragment>
                < NoticeBox title={`WARNING! ${selected.selectedRows.length} rows will be affected`} warning>
                    No one will be able to access this program. Add some Organisation Units to the access list.
                </NoticeBox>
                <br />
            </React.Fragment>
            <Form initialValues={initialValues} onSubmit={onSubmit}>
                {({ handleSubmit, values, form }) => {
                    formRef.current = form;
                    return <form
                        onSubmit={handleSubmit}
                        onChange={onChange(values)}
                    >
                        {
                            enrollmentDetailsForm(enrollmentsDetailsData).map((field: any, index: number) => (
                                <GroupForm
                                    name={field.section}
                                    description={field.description}
                                    key={index}
                                    fields={field.fields}
                                    disabled={false}
                                />
                            ))
                        }
                        <br />
                        <ModalActions>
                            <ButtonStrip end>
                                {modalActions.map((action, i) => (
                                    <Button
                                        key={i}
                                        {...action}
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </ButtonStrip>
                        </ModalActions>
                    </form>
                }}
            </Form>
        </WithPadding >
    )
}

export default ModalContentPromotion;
