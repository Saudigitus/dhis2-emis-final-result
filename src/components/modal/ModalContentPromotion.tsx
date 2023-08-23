import React, { useState, useEffect, useRef } from "react";
import { ModalActions, Button, ButtonStrip, CircularLoader, CenteredContent, NoticeBox } from "@dhis2/ui";
import WithPadding from "../template/WithPadding";
import { Form } from "react-final-form";
import { formFields } from "../../utils/constants/enrollmentForm/enrollmentForm";
import useGetEnrollmentForm from "../../hooks/form/useGetEnrollmentForm";
import GroupForm from "../form/GroupForm";
import { useRecoilState } from "recoil";
import { useParams } from "../../hooks/commons/useQueryParams";
import usePostTei from "../../hooks/tei/usePostTei";
import { format } from "date-fns";
import { onSubmitClicked } from "../../schema/formOnSubmitClicked";
import { RowSelectionState } from "../../schema/tableSelectedRowsSchema";
import { usePostEvent } from "../../hooks/events/useCreateEvents";
import { enrollmentDetailsForm } from "../../utils/constants/enrollmentForm/enrollmentDetailsForm";
interface ContentProps {
    setOpen: (value: boolean) => void
}

function ModalContentPromotion({ setOpen }: ContentProps): React.ReactElement {
    const { useQuery } = useParams();
    const formRef: React.MutableRefObject<FormApi<IForm, Partial<IForm>>> = useRef(null);
    const orgUnitName = useQuery().get("schoolName");
    const { enrollmentsDetailsData } = useGetEnrollmentForm();
    const [, setClicked] = useRecoilState<boolean>(onSubmitClicked);
    const [, setValues] = useState<object>({})
    const [fieldsWitValue, setFieldsWitValues] = useState<any[]>([enrollmentsDetailsData])
    const [clickedButton, setClickedButton] = useState<string>("");
    const [selected] = useRecoilState(RowSelectionState);
    const { loadUpdateEvent, updateEvent, data } = usePostEvent();
    const [initialValues] = useState<object>({
        registerschoolstaticform: orgUnitName,
        eventdatestaticform: format(new Date(), "yyyy-MM-dd")
    })

    useEffect(() => {
        if (data !== undefined && data?.status === "OK") {
            if (clickedButton === "saveandcontinue") {
                setOpen(false)
            }
            setClicked(false)
            formRef.current.restart()
        }
    }, [data])

    useEffect(() => { setClicked(false) }, [])

    console.log(selected);

    function onSubmit() {
        const allFields = fieldsWitValue.flat()
        if (allFields.filter((element: any) => (element?.value === undefined && element.required)).length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
            const events = []
            for (const event of selected.selectedRows) {
                events.push(
                    {
                        ...event,
                        dataValues: [{ dataElement: allFields[0].id, value: allFields[0].value }]
                    })
            }
            void updateEvent({ data: { events } })
        }
    }

    const modalActions = [
        { id: "cancel", type: "button", label: "Cancel", disabled: loadUpdateEvent, onClick: () => { setClickedButton("cancel"); setOpen(false) } },
        { id: "saveandcontinue", type: "submit", label: "Perform promotion", primary: true, disabled: loadUpdateEvent, onClick: () => { setClickedButton("saveandcontinue"); setClicked(true) } }
    ];

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
                    sections[i].find((element: any) => element.id === key).value = value
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
                                        {(loadUpdateEvent && action.id === clickedButton) ? <CircularLoader small /> : action.label}
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
