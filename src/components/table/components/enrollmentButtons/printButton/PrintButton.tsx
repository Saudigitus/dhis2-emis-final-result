import React, { useState } from 'react'
import Item from './Item'
import classNames from 'classnames'
import { useRecoilState, useRecoilValue } from 'recoil'
import style from "./printButton.module.css"
import { SimpleSearch } from '../../../../search'
import { DropdownButton, FlyoutMenu } from "@dhis2/ui"
import { OuQueryString } from '../../../../../schema/headerSearchInputSchema'
import { PrintButtonProps } from '../../../../../types/table/EnrollmentActionProps'
import { PrintTemplateState } from '../../../../../schema/printTemplateSchema'

export default function PrintButton(props: PrintButtonProps): React.ReactElement {
    const { label, placeholder, id } = props
    const templates = useRecoilValue(PrintTemplateState)
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const [, setStringQuery] = useRecoilState(OuQueryString);
    const onToggle = () => {
        setStringQuery(undefined)
        setOpenDropDown(!openDropDown)
    }

    return (
        <DropdownButton
            open={openDropDown}
            onClick={onToggle}
            className={classNames(style.buttonContainer)}
            component={
                < FlyoutMenu >
                    <SimpleSearch id={id} placeholder={placeholder}>
                        <Item options={templates || []}/> 
                    </SimpleSearch>
                </FlyoutMenu >
            }
        >
            <span>{label}</span>
        </DropdownButton >
    )
}
