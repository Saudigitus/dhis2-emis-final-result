import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../Table.module.css';
import { RowCellProps } from '../../../../types/table/components/row/RowCellTypes';

function RowCell(props: RowCellProps): React.ReactElement {
    const { children, className, passOnProps, table, colspan } = props;

    const classes = classNames(
        defaultClasses.tableCell,
        {
            [defaultClasses.tableCellBody]: !table,
            [defaultClasses.tableCellHeader]: table && table.head,
            [defaultClasses.tableCellFooter]: table && table.footer,
        },
        className,
    );
    
    return (
        <td
            className={classes}
            {...passOnProps}
            colSpan={colspan}
        >
            {children}
        </td>
    );
};

export default RowCell