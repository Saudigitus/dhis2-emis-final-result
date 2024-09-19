import { format } from "date-fns";
import { type FormSectionProps } from "../../../types/fields/FieldsTypes";
import { VariablesTypes } from "../../../types/variables/AttributeColumns";
import { dataStoreRecordStaffFormConfig } from "../../../types/dataStore/DataStoreConfig";

const staticForm = () => {
    return {
        registeringSchool: {
            required: true,
            name: "registerschoolstaticform",
            labelName: "Registering School",
            valueType: "TEXT",
            options: undefined,
            disabled: true,
            pattern: "",
            visible: true,
            description: "Registering School",
            searchable: false,
            error: false,
            programStage: "",
            content: "",
            id: "registerschoolstaticform",
            displayName: "Registering School",
            header: "Registering School",
            type: VariablesTypes.DataElement,
            assignedValue: undefined
        },
        enrollmentDate: {
            required: true,
            name: "enrollment_date",
            labelName: "Enrollment date",
            valueType: "DATE",
            options: undefined,
            disabled: false,
            pattern: "",
            visible: true,
            description: "Enrollment date",
            searchable: false,
            error: false,
            programStage: "",
            content: "",
            id: "enrollment_date",
            displayName: "Enrollment date",
            header: "Enrollment date",
            type: VariablesTypes.DataElement,
            assignedValue: format(new Date(), "yyyy-MM-dd")
        }
    }
}

function enrollmentDetailsForm(enrollmentsDetailsData: any[], variableToShowOnForm: string): FormSectionProps[] {
    const [enrollmentDetails] = enrollmentsDetailsData || [{ "enrollmentDetails": [] }];

    return [
        {
            section: "Re-enroll",
            description: "Staff re-enroll details",
            fields: [
                staticForm().registeringSchool,
                ...enrollmentDetails?.filter((dataElements: any) => variableToShowOnForm === dataElements.id),
                staticForm().enrollmentDate
            ]
        }
    ];
}

export { enrollmentDetailsForm, staticForm };
