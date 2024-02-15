import React from 'react'
import { Input } from "@dhis2/ui"
import classNames from 'classnames'
import style from "./search.module.css"
import { SimpleSearchProps } from '../../types/simpleSearch/SimpleSearchTypes'

export default function SimpleSearch({ children, placeholder, id }: SimpleSearchProps): React.ReactElement {
    return (
        <div className={classNames(style.SimpleSearchContainer, style[id])}>
            <div className={style.SimpleSearcInputContainer}>
                <Input placeholder={placeholder} initialFocus dense label="An input" name="input" />
            </div>
            <div className={style.ChildrenContentContainer}>{children}</div>
        </div>
    )
}
