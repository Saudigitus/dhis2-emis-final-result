import React from 'react'
import classNames from 'classnames';
import defaultClasses from '../table.module.css';
import { TableComponentProps } from '../../../../types/table/TableContentTypes';

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
