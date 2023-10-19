import { format } from "date-fns";
import { type FormSectionProps } from "../../../types/fields/FieldsTypes";
import { VariablesTypes } from "../../../types/table/AttributeColumns";

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
            value: undefined
        },
        enrollmentDate: {
            required: true,
            name: "eventdatestaticform",
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
            id: "eventdatestaticform",
            displayName: "Enrollment date",
            header: "Enrollment date",
            type: VariablesTypes.DataElement,
            value: format(new Date(), "yyyy-MM-dd")
        }
    }
}

function enrollmentDetailsForm(enrollmentsDetailsData: any[]): FormSectionProps[] {
    const [enrollmentDetails] = enrollmentsDetailsData;

    return [
        {
            section: "Final Result",
            description: "Student final result",
            fields: [
                staticForm().registeringSchool,
                ...enrollmentDetails,
                staticForm().enrollmentDate
            ]
        }
    ];
}

export { enrollmentDetailsForm, staticForm };