import React from "react";
import { ReactFinalForm, CheckboxFieldFF, hasValue, Label } from "@dhis2/ui";

interface CheckFieldProps {
  disabled: boolean
  required: string | boolean
}

const { Field } = ReactFinalForm;

function CheckInput(props: CheckFieldProps) {
  return (
    <div className="d-flex">
      <Field
        {...props}
        type="checkbox"
        component={CheckboxFieldFF}
        validate={Boolean(props.required) && hasValue}
        disabled={props.disabled}
      />
      <Label className="mt-1">Yes</Label>
    </div>
  );
}

export default CheckInput;
