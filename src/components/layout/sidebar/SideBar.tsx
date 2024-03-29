import React, { useState } from 'react'
import style from "./sideBar.module.css"
import { useLocation } from 'react-router-dom'
import { SideBarItem, SibeBarCollapseBtn } from './components'
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"
import { getDataStoreKeys } from '../../../utils/commons/dataStore/getDataStoreKeys'

export default function SideBar(): React.ReactElement {
    const location = useLocation()  
    const { filterItems } = getDataStoreKeys()
    const [collapsed, setCollapsed] = useState<boolean>(true);

    return (
        <aside className={collapsed ? style.SideBarContainerCollapsed : style.SideBarContainer}>
            <div className={style.SideBarMenu}>
                {
                    sideBarData(location.search, filterItems).map((element, index) => (
                        <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                    ))
                }
            </div>
            <SibeBarCollapseBtn collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
    )
}
