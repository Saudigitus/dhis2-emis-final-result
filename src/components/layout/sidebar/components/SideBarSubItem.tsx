import React from 'react';
import classNames from 'classnames';
import Badge from '../../../badge/Badge';
import style from "../sideBar.module.css"
import { useConfig } from '@dhis2/app-runtime';
import { useLocation } from 'react-router-dom';
import { type SideBarSubItemProps } from '../../../../types/sideBar/SideBarTypes';
import { useQueryParams } from '../../../../hooks/commons/useQueryParams';

export default function SideBarSubItem(props: SideBarSubItemProps) {
    const { icon, label, showBadge, disabled, route, appName, pathName } = props;
    const location = useLocation()
    const { baseUrl } = useConfig()
    const { urlParamiters } = useQueryParams()
    const { sectionType } = urlParamiters()
    const formattedPathName = `${location.pathname}/${sectionType}`

    return (
        <a href={`${baseUrl}/api/apps/${appName}/index.html#/${route}`} className={style.subItemLink}>
            <li className={formattedPathName === pathName ? style.SideBarSubItemContainerActive : classNames(style.SideBarSubItemContainer, (Boolean(disabled)) && style.SideBarDisabledSubItem)}>
                <img src={icon} /> <span className={style.SideBarSubItemLabel}>{label}</span>
                {showBadge ? <div className={style.BadgeContainer}><Badge value='10' /></div> : null}
                <div className={style.TooltipContainer}>
                    {label}
                </div>
            </li>
        </a>
    )
}
