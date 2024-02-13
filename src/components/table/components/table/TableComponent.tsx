import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../Table.module.css';
import { TableComponentProps } from '../../../../types/table/components/table/TableComponentTypes';

function TableComponent(props: TableComponentProps): React.ReactElement {
    const { children, className, ...passOnProps } = props;
    const classes = classNames(defaultClasses.table, className);
    return (
        <table
            className={classes}
            {...passOnProps}
        >
            {children}
        </table>
    );
}

export default TableComponent
