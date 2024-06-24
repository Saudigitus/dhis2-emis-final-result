import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Form } from "react-final-form";
import { useRecoilState } from "recoil";
import { WithPadding, GroupForm } from "../../../components";
import { ContentProps } from "../../../types/modal/ModalContentTypes";
import { onSubmitClicked } from "../../../schema/formOnSubmitClicked";
import { RowSelectionState } from "../../../schema/tableSelectedRowsSchema";
import { useQueryParams, useShowAlerts, usePromoteStudent, useGetEnrollmentForm } from "../../../hooks";
import { enrollmentDetailsForm } from "../../../utils/constants/enrollmentForm/enrollmentDetailsForm";
import { ModalActions, Button, ButtonStrip, CircularLoader, CenteredContent, NoticeBox } from "@dhis2/ui";
import { CustomDhis2RulesEngine } from "../../../hooks/programRules/rules-engine/RulesEngine";
import { formatKeyValueType } from "../../../utils/programRules/formatKeyValueType";
import { getSelectedKey } from "../../../utils/commons/dataStore/getSelectedKey";


function ModalContentPromotion(props: ContentProps): React.ReactElement {
    const { setOpen, setOpenSummary, setSummaryData, enrollmentsDetailsData } = props
    const { useQuery } = useQueryParams();
    const formRef: React.MutableRefObject<FormApi<IForm, Partial<IForm>>> = useRef(null);
    const orgUnitName = useQuery().get("schoolName");
    const orgUnit = useQuery().get("school");
    const [, setClicked] = useRecoilState<boolean>(onSubmitClicked);
    const [values, setValues] = useState<object>({ orgUnit })
    const [fieldsWitValue, setFieldsWitValues] = useState<any[]>([enrollmentsDetailsData])
    const [enrollmentDate, setEnrollmentDate] = useState<any>(format(new Date(), "yyyy-MM-dd"));
    const [clickedButton, setClickedButton] = useState<string>("");
    const [selected] = useRecoilState(RowSelectionState);
    const { promoteStudents, mutateState,loadingPromote } = usePromoteStudent();
    const { hide, show } = useShowAlerts()
    const [initialValues] = useState<object>({
        registerschoolstaticform: orgUnitName,
        enrollment_date: format(new Date(), "yyyy-MM-dd")
    })

    useEffect(() => { setClicked(false) }, [])

    const { runRulesEngine, updatedVariables } = CustomDhis2RulesEngine({
        variables: enrollmentDetailsForm(enrollmentsDetailsData),
        values,
        type: "programStageSection",
        formatKeyValueType: formatKeyValueType(enrollmentsDetailsData)
    })

    useEffect(() => {
        runRulesEngine()
    }, [values])

    function onSubmit() {
        const allFields = fieldsWitValue.flat()
        if (allFields.filter((element: any) => (element?.assignedValue === undefined && element.required)).length === 0) {
            // FILTER ALL SELECTED ROWS TEI
            const trackedEntities = selected.rows.map((row: any) => row.tei).filter(tei => {
                return selected.selectedRows.some(event => tei?.trackedEntity === event?.trackedEntity);
            })

            let idsUnicos = new Set();

            // Filtrar a lista, mantendo apenas os objetos com ids únicos
            let listaSemDuplicados = selected.rows.map((row: any) => row.tei).filter(tei => {
                return selected.selectedRows.some(event => tei?.trackedEntity === event?.trackedEntity);
            }).filter(obj => {
                if (!idsUnicos.has(obj.trackedEntity)) {
                    idsUnicos.add(obj.trackedEntity);
                    return true;
                }
                return false;
            });

            void promoteStudents(listaSemDuplicados, fieldsWitValue, enrollmentDate, setOpenSummary, setSummaryData)
                .then(() => {
                    setOpen(false)
                })
        }
    }

    const modalActions = [
        { id: "cancel", type: "button", label: "Cancel", disabled: mutateState.loading || loadingPromote, onClick: () => { setClickedButton("cancel"); setOpen(false) } },
        { id: "saveandcontinue", type: "submit", label: "Perform promotion", primary: true, disabled: mutateState.loading || loadingPromote, loading: mutateState.loading || loadingPromote, onClick: () => { setClickedButton("saveandcontinue"); setClicked(true) } }
    ];

    if (mutateState.error) {
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
                } else if (key === "enrollment_date") {
                    setEnrollmentDate(value)
                }
            }
        }
        setFieldsWitValues(sections)
        setValues(e)
    }

    // console.log(updatedVariables, enrollmentDetailsForm(enrollmentsDetailsData), enrollmentsDetailsData);

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
                            updatedVariables?.map((field: any, index: number) => (
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
