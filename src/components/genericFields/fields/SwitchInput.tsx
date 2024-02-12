import React from 'react'
import { ReactFinalForm, SwitchFieldFF, hasValue } from '@dhis2/ui'

interface SwitchFieldProps {
    disabled: boolean
    required: string | boolean
}

const { Field } = ReactFinalForm

function SwitchInput(props: SwitchFieldProps) {
    return (
        <Field
            {...props}
            type="checkbox"
            component={SwitchFieldFF}
            validate={(Boolean(props.required)) && hasValue}
            disabled={props.disabled}
        />
    )
}

export default SwitchInput
