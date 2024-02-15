import React from 'react'
import defaultClasses from '../../table.module.css';

export function TextPagination(text: string): React.ReactElement {
    return (
        <span className={defaultClasses.textPagination}>
            {text}
        </span>
    )
}
