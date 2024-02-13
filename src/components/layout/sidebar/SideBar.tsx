import React, { useState } from 'react'
import style from "./SideBar.module.css"
import { SideBarItem, SibeBarCollapseBtn } from './components'
import { sideBarData } from "../../../utils/constants/sideBar/sideBarData"

export default function SideBar(): React.ReactElement {
    const [collapsed, setCollapsed] = useState<boolean>(true);

    return (
        <aside className={collapsed ? style.SideBarContainerCollapsed : style.SideBarContainer}>
            <div className={style.SideBarMenu}>
                {
                    sideBarData().map((element, index) => (
                        <SideBarItem key={index} title={element.title} subItems={element.subItems} />
                    ))
                }
            </div>
            <SibeBarCollapseBtn collapsed={collapsed} setCollapsed={setCollapsed} />
        </aside>
    )
}
