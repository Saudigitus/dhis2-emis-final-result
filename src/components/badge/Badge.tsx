import React from 'react'
import style from "./badge.module.css"
import { BadgeProps } from '../../types/badge/BadgeTypes'

export default function Badge({ value }: BadgeProps): React.ReactElement {
    return (
        <span className={style.BadgeContainer}>{value}</span>
    )
}
