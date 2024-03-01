import React from 'react'
import defaultClasses from '../../table.module.css';
import { TextPaginationProps } from '../../../../../types/table/PaginationTypes';

export function TextPagination(props : TextPaginationProps): React.ReactElement {
    const { text } = props;

    return (
        <span className={defaultClasses.textPagination}>
            {text}
        </span>
    )
}
