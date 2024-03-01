import React from 'react'
import { IconButton } from '@material-ui/core';
import defaultClasses from '../../table.module.css';
import { IconButtonPaginationProps } from '../../../../../types/table/PaginationTypes';

export function IconButtonPagination(props: IconButtonPaginationProps): React.ReactElement {
    const {onPageChange, disabled, ariaLabel, icon } = props;

    return (
        <IconButton
            className={defaultClasses.paginationIconButton}
            onClick={onPageChange}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {icon}
        </IconButton>
    )
}
