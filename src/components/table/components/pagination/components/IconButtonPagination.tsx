import React from 'react'
import { IconButton } from '@material-ui/core';
import defaultClasses from '../../Table.module.css';
import { IconButtonPaginationProps } from '../../../../../types/table/components/pagination/PaginationTypes';

export function IconButtonPagination(props: IconButtonPaginationProps): React.ReactElement {
    return (
        <IconButton
            className={defaultClasses.paginationIconButton}
            // corrigir este erro 👇
            onClick={props.onPageChange}
            disabled={props.disabled}
            aria-label={props.ariaLabel}
        >
            {props.Icon}
        </IconButton>
    )
}