import {
  ReactFinalForm,
  TextAreaFieldFF,
  composeValidators,
  hasValue,
  string
} from "@dhis2/ui";
import React from "react";
import style from "./fields.module.css";
import { FormFieldsProps } from "../../../types/fields/GenericFieldsTypes";

const { Field } = ReactFinalForm;

const VALIDATOR = composeValidators(string, hasValue);

function InputArea(props: FormFieldsProps) {
  return (
    <Field
      {...props}
      component={TextAreaFieldFF}
      validate={Boolean(props.required) && VALIDATOR}
      type="text"
      required
      label={null}
      className={style.textfield}
      disabled={props.disabled}
    />
  );
}

export default InputArea;
