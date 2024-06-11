import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../table.module.css';
import { RowTableProps } from '../../../../types/table/TableContentTypes';
import { Tooltip } from '@material-ui/core';

function RowTable(props: RowTableProps): React.ReactElement {
    const { children, className, table, isOwnershipOu=true, ...passOnProps } = props;

    const classes = classNames(
        defaultClasses.tableRow,
        {
            [defaultClasses.tableRowBody]: table == null,
            [defaultClasses.tableRowHeader]: table?.head,
            [defaultClasses.tableRowFooter]: table?.footer
        },
        className,
        !isOwnershipOu && defaultClasses.disabledRowOwnershipOu
    );

    return (
        <Tooltip arrow={true} /* disableHoverListener={!inactive || !isOwnershipOu} */ disableFocusListener
            title={!isOwnershipOu ? 'This student was transferred to another school' : ""}>
            <tr
                className={classes}
                {...passOnProps}
            >
                {children}
            </tr>
        </Tooltip>
    )
}

export default RowTable
