import React from 'react'
import { ReactFinalForm, SwitchFieldFF, hasValue } from '@dhis2/ui'
import { SwitchInputProps } from '../../../types/fields/SwitchTypes'


const { Field } = ReactFinalForm

function SwitchInput(props: SwitchInputProps) {
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
