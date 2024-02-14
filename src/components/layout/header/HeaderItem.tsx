import React, { useState } from 'react'
import classNames from 'classnames'
import style from "./MainHeader.module.css"
import { SimpleSearch } from '../../search'
import { DropdownButton, FlyoutMenu } from "@dhis2/ui"
import info from "../../../assets/images/headbar/info.svg"
import { type HeadBarTypes } from '../../../types/headBar/HeadBarTypes'
import { componentMapping } from '../../../utils/commons/componentMapping'
import HeaderResetItemValue from './HeaderResetItemValue'
import { useQueryParams } from '../../../hooks'
import { getSelectedKey } from '../../../utils/commons/dataStore/getSelectedKey'
import { resetHeaderFilter } from '../../../utils/commons/resetHeaderFilters'

export default function HeaderItem({ label, value, placeholder, component, dataElementId, id, selected }: HeadBarTypes): React.ReactElement {
    const { remove } = useQueryParams()
    const { getDataStoreData } = getSelectedKey()
    const onToggle = () => { setOpenDropDown(!openDropDown) }
    const [openDropDown, setOpenDropDown] = useState<boolean>(false);
    const Component = (component != null) ? componentMapping[component] : null; 
    const onReset = () => resetHeaderFilter(remove, dataElementId, getDataStoreData)


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
