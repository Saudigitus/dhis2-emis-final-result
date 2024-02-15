import React from "react";
import style from "./fields.module.css";
import { type GenericFieldsProps } from "../../../types/fields/GenericFieldsTypes";
import { ReactFinalForm, TextAreaFieldFF, composeValidators, hasValue, string } from "@dhis2/ui";

const { Field } = ReactFinalForm;

const VALIDATOR = composeValidators(string, hasValue);

function InputArea(props: GenericFieldsProps) {
  return (
    <Field
      {...props}
      component={TextAreaFieldFF}
      validate={Boolean(props.attribute.required) && VALIDATOR}
      type="text"
      required
      label={null}
      className={style.textfield}
      disabled={props.disabled}
    />
  );
}

export default InputArea;
