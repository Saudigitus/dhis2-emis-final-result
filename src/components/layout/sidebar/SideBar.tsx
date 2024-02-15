import React, { useState } from 'react'
import style from "./sideBar.module.css"
import { SideBarItem, SibeBarCollapseBtn } from './components'
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"
import { getDataStoreKeys } from '../../../utils/commons/dataStore/getDataStoreKeys'

export default function SideBar(): React.ReactElement {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const { currentAcademicYear } = getDataStoreKeys()   

    return (
        <aside className={collapsed ? style.SideBarContainerCollapsed : style.SideBarContainer}>
            <div className={style.SideBarMenu}>
                {
                    sideBarData(currentAcademicYear).map((element, index) => (
                        <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                    ))
                }
            </div>
            <SibeBarCollapseBtn collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
    )
}
