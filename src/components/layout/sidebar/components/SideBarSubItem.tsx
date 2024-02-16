import React from 'react';
import classNames from 'classnames';
import Badge from '../../../badge/Badge';
import style from "../sideBar.module.css"
import { useConfig } from '@dhis2/app-runtime';
import { type SideBarSubItemProps } from '../../../../types/sideBar/SideBarTypes';

export default function SideBarSubItem({ icon, label, showBadge, disabled, route, appName, pathName }: SideBarSubItemProps) {
    const { baseUrl } = useConfig()    

    return (
        <a href={`${baseUrl}/api/apps/${appName}/index.html#/${route}`} className={style.subItemLink}>
            <li className={location.pathname === pathName ? style.SideBarSubItemContainerActive : classNames(style.SideBarSubItemContainer, (Boolean(disabled)) && style.SideBarDisabledSubItem)}>
                <img src={icon} /> <span className={style.SideBarSubItemLabel}>{label}</span>
                {showBadge ? <div className={style.BadgeContainer}><Badge value='10' /></div> : null}
                <div className={style.TooltipContainer}>
                    {label}
                </div>
            </li>
        </a>
    )
}
