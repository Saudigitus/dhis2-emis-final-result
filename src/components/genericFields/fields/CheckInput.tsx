import React from "react";
import { CheckInputProps } from "../../../types/fields/CheckInputTypes";
import { ReactFinalForm, CheckboxFieldFF, hasValue, Label } from "@dhis2/ui";

const { Field } = ReactFinalForm;

function CheckInput(props: CheckInputProps) {
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
