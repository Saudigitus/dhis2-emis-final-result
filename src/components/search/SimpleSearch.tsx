import React from 'react'
import { Input } from "@dhis2/ui"
import classNames from 'classnames'
import style from "./Search.module.css"

export default function SimpleSearch({ children, placeholder, id }: { children: React.ReactNode, placeholder: string, id: string }): React.ReactElement {
    return (
        <div className={classNames(style.SimpleSearchContainer, style[id])}>
            <div className={style.SimpleSearcInputContainer}>
                <Input placeholder={placeholder} initialFocus dense label="An input" name="input" />
            </div>
            <div className={style.ChildrenContentContainer}>{children}</div>
        </div>
    )
}
