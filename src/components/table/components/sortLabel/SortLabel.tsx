import React from 'react'
import { TableSortLabel } from '@material-ui/core';
import { TableSortProps } from '../../../../types/table/TableContentTypes';

function SortLabel(props: TableSortProps): React.ReactElement {
    const { active, direction, createSortHandler, children } = props;
    return (
        <TableSortLabel
            active={active}
            direction={direction}
            onClick={(page: any) => { createSortHandler(page) }}
        >
            {children}
        </TableSortLabel>
    )
}

export default SortLabel
