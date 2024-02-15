import React, { useState } from 'react'
import classNames from 'classnames'
import style from "./mainHeader.module.css"
import { SimpleSearch } from '../../search'
import { DropdownButton, FlyoutMenu } from "@dhis2/ui"
import info from "../../../assets/images/headbar/info.svg"
import { type HeadBarTypes } from '../../../types/headBar/HeadBarTypes'
import { componentMapping } from '../../../utils/commons/componentMapping'

export default function HeaderItem({ label, value, placeholder, component, dataElementId, id }: HeadBarTypes): React.ReactElement {
    const Component = (component != null) ? componentMapping[component] : null;
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const onToggle = () => { setOpenDropDown(!openDropDown) }

    return (
        <DropdownButton
            open={openDropDown}
            onClick={onToggle}
            className={classNames(style.HeaderItemContainer, style[id])}
            component={
                < FlyoutMenu >
                    <SimpleSearch id={id} placeholder={placeholder}>
                        {(Component != null) && <Component dataElementId={dataElementId} onToggle={onToggle} />}
                    </SimpleSearch>
                </FlyoutMenu >
            }
        >
            <h5>{label} <span>{value}</span></h5>
            <img src={info} />
        </DropdownButton >
    )
}
