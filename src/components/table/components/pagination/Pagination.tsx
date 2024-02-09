import { IconButton } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import React from 'react'
import Select from 'react-select';
import defaultClasses from '../table.module.css';
import { disableNextPage } from '../../../../utils/table/pagination/pagination';
import { rowsPerPages } from '../../../../utils/constants/pagination/pagination';

interface PaginationProps {
    page: number
    rowsPerPage: number
    onPageChange: (page: number) => void
    onRowsPerPageChange: (rowsPerPage: number) => void
    loading: boolean
    totalPerPage: number
}

interface IconButtonPaginationProps {
    onPageChange: (page: number) => void
    ariaLabel: string
    disabled: boolean
    Icon: React.ReactNode
}

function textPagination(text: string): React.ReactElement {
    return (
        <span className={defaultClasses.textPagination}>
            {text}
        </span>
    )
}

function IconButtonPagination(props: IconButtonPaginationProps): React.ReactElement {
    return (
        <>
            <IconButton
                className={defaultClasses.paginationIconButton}
                // corrigir este erro 👇
                onClick={props.onPageChange}
                disabled={props.disabled}
                aria-label={props.ariaLabel}
            >
                {props.Icon}
            </IconButton>
        </>
    )
}

function Pagination({ page, rowsPerPage, onPageChange, onRowsPerPageChange, loading, totalPerPage }: PaginationProps): React.ReactElement {
    return (
        <div
            className={defaultClasses.pagination}
        >
            <div />

            <div className={defaultClasses.rootPagination}>
                {textPagination("Rows per page")}

                <Select
                    className={defaultClasses.textPagination}
                    value={rowsPerPage}
                    clearValueText={false}
                    style={{ marginTop: -5 }}
                    options={rowsPerPages}
                    clearable={false}
                    searchable={false}
                    onChange={onRowsPerPageChange}
                    menuContainerStyle={{ top: 'auto', bottom: '100%' }}
                />
                {textPagination(`Page ${page}`)}

                <IconButtonPagination
                    Icon={<KeyboardArrowLeft />}
                    ariaLabel='Previous Page'
                    disabled={page <= 1 || loading}
                    onPageChange={() => { onPageChange(page - 1); }}
                />

                <IconButtonPagination
                    Icon={<KeyboardArrowRight />}
                    ariaLabel='Next Page'
                    disabled={disableNextPage({ rowsPerPage, totalPerPage }) || loading}
                    onPageChange={() => { onPageChange(page + 1); }}
                />

            </div>
        </div>
    )
}

export default Pagination
