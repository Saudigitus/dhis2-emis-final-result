import React from "react"
import { Label } from "@dhis2/ui"
import classNames from "classnames"
import styles from "./groupForm.module.css"
import type { GroupFormProps } from "../../types/groupForm/GroupFormTypes"
import { WithBorder, WithPadding, GenericFields, Subtitle } from "../index"

function GroupForm(props: GroupFormProps) {
  const { name, fields, description } = props
  return (
    <WithBorder type={"all"}>
      <WithPadding p={"16px 5px 0px 5px"}>
        <Subtitle label={name} />
        <WithPadding />
        <Label>{description}</Label>
        <WithPadding p="0.2rem" />
        <WithPadding p="10px">
          {fields
            ?.filter((x) => x.visible)
            ?.map((x, i) => {
              return (
                <div
                  key={i}
                  className={classNames(
                    "row d-flex align-items-center",
                    x.error
                      ? styles.errorFormField
                      : x.warning
                      ? styles.warningFormField
                      : styles.notErrorFormField,
                    i % 2 === 0 ? styles.evenFormField : styles.oddFormField
                  )}
                >
                  <div className="col-12 col-md-6 d-flex">
                    <Label className={styles.label}>
                      {x.labelName} {x.required ? " *" : ""}
                    </Label>
                  </div>
                  <div className="col-12 col-md-6">
                    <GenericFields
                      attribute={x}
                      disabled={x.disabled}
                      valueType={x.valueType}
                    />
                    <span className={styles.helpText}>{x.content}</span>
                  </div>
                </div>
              )
            })}
        </WithPadding>
      </WithPadding>
    </WithBorder>
  )
}

export default GroupForm
