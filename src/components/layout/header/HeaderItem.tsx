import React, { useState } from 'react'
import classNames from 'classnames'
import style from "./mainHeader.module.css"
import { SimpleSearch } from '../../search'
import { DropdownButton, FlyoutMenu } from "@dhis2/ui"
import info from "../../../assets/images/headbar/info.svg"
import { type HeadBarTypes } from '../../../types/headBar/HeadBarTypes'
import { componentMapping } from '../../../utils/commons/componentMapping'
import HeaderResetItemValue from './HeaderResetItemValue'
import { useDataElementsParamMapping, useQueryParams } from '../../../hooks'

export default function HeaderItem({ label, value, placeholder, component, dataElementId, id, selected }: HeadBarTypes): React.ReactElement {
    const { remove } = useQueryParams()
    const onToggle = () => { setOpenDropDown(!openDropDown) }
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const Component = (component != null) ? componentMapping[component] : null; 
    const paramsMapping = useDataElementsParamMapping()
    
    const onReset = () => {
        if(dataElementId)
            remove(paramsMapping[dataElementId as unknown as keyof typeof paramsMapping])
        else
            if(id === "c540ac7c") {
                remove("school");
                remove("schoolName");
            }
    }

    return (
        <div className={classNames(style.HeaderItemGroup)}>
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
            { selected && <HeaderResetItemValue onReset={onReset}/> }
        </div>
    )
}
