import React, { useState } from 'react'
import Item from './Item'
import classNames from 'classnames'
import { useRecoilState, useRecoilValue } from 'recoil'
import style from "./printButton.module.css"
import { SimpleSearch } from '../../../../search'
import { DropdownButton, FlyoutMenu, IconFileDocument24 } from "@dhis2/ui"
import { OuQueryString } from '../../../../../schema/headerSearchInputSchema'
import { PrintButtonProps } from '../../../../../types/table/EnrollmentActionProps'
import { PrintTemplateState } from '../../../../../schema/printTemplateSchema'

export default function PrintButton(props: PrintButtonProps): React.ReactElement {
    const { label, placeholder, id, disabled } = props
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
            disabled={disabled}
            icon={<IconFileDocument24/>}
            className={classNames(style.buttonContainer, disabled ? style.buttonContainerDisabled : style.buttonContainerEnabled)}
            component={
                < FlyoutMenu >
                    <SimpleSearch id={id} placeholder={placeholder}>
                        <Item options={templates || []} onToggle={onToggle}/> 
                    </SimpleSearch>
                </FlyoutMenu >
            }
        >
            <span>{label}</span>
        </DropdownButton >
    )
}
