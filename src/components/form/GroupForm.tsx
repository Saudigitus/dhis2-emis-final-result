import React from "react";
import { Label } from "@dhis2/ui";
import classNames from "classnames";
import styles from "./GroupForm.module.css";
import { WithBorder, WithPadding, GenericFields, Subtitle } from "../index";
import { type CustomAttributeProps } from "../../types/table/AttributeColumns";

interface FormProps {
    name: string
    description: string
    fields: CustomAttributeProps[]
    disabled: boolean
}

function GroupForm(props: FormProps) {
    const { name, fields, description } = props

    return (
        <WithBorder type={"all"}>
            <WithPadding p={"16px 5px 0px 5px"}>
                <Subtitle label={name} />
                <WithPadding />
                <Label>{description}</Label>
                <WithPadding p="0.2rem" />
                <WithPadding p="10px">
                    {fields?.filter(x => x.visible)?.map((x, i) => {
                        return (
                            <div 
                            key={i}
                            className={
                                classNames( "row d-flex align-items-center", 
                                x.error ? styles.errorFormField : styles.notErrorFormField,
                                i % 2 === 0 ? styles.evenFormField  : styles.oddFormField)}
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
                                    <span className={styles.helpText}>
                                        {x.content}
                                    </span>
                                </div>
                            </div>
                        )
                    }
                    )}
                </WithPadding>
            </WithPadding>
        </WithBorder>
    )
}

export default GroupForm;
