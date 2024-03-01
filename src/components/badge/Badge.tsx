import React from 'react'
import style from "./badge.module.css"
import { BadgeProps } from '../../types/badge/BadgeTypes'

export default function Badge(props: BadgeProps): React.ReactElement {
    const { value } = props;
    
    return (
        <span className={style.BadgeContainer}>{value}</span>
    )
}
