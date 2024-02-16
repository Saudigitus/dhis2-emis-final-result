import React, { useState, useEffect } from 'react'
import style from "./sideBar.module.css"
import { SideBarItem, SibeBarCollapseBtn } from './components'
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"
import { getDataStoreKeys } from '../../../utils/commons/dataStore/getDataStoreKeys'
import { useLocation } from 'react-router-dom'

export default function SideBar(): React.ReactElement {
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const { currentAcademicYear } = getDataStoreKeys()  
    const location = useLocation()     

    return (
        <aside className={collapsed ? style.SideBarContainerCollapsed : style.SideBarContainer}>
            <div className={style.SideBarMenu}>
                {
                    sideBarData(currentAcademicYear, location.search).map((element, index) => (
                        <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                    ))
                }
            </div>
            <SibeBarCollapseBtn collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
    )
}
