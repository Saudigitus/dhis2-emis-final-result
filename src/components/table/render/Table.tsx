import React, { useEffect, useState } from 'react'
import RenderRows from './RenderRows'
import RenderHeader from './RenderHeader'
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilState, useRecoilValue } from 'recoil';
import { teiRefetch } from '../../../hooks/tei/usePostTei';
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { WithBorder, WithPadding } from '../../../components';
import { HeaderFieldsState } from '../../../schema/headersSchema';
import WorkingLits from '../components/filters/workingList/WorkingLits';
import { HeaderFilters, Pagination, TableComponent } from '../components'
import { useQueryParams, useTableData, useHeader  } from '../../../hooks';

const usetStyles = makeStyles({
    tableContainer: {
        overflowX: 'auto'
    }
});

function Table() {
    const classes = usetStyles()
    const { columns } = useHeader()
    const { getData, loading, tableData } = useTableData()
    const { useQuery } = useQueryParams();
    const school = useQuery().get('school');
    const grade = useQuery().get('grade');
    const section = useQuery().get('class');
    const headerFieldsState = useRecoilValue(HeaderFieldsState)
    const [page, setpage] = useState(1)
    const [pageSize, setpageSize] = useState(10)
    const [refetch] = useRecoilState(teiRefetch)

    useEffect(() => {
        void getData(page, pageSize)
    }, [school, headerFieldsState, grade, section, page, pageSize, refetch])

    const onPageChange = (newPage: number) => {
        setpage(newPage)
    }

    const onRowsPerPageChange = (event: any) => {
        setpageSize(parseInt(event.value, 10))
        setpage(1)
    }

    return (
        <Paper>
            {loading &&
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            }
            <WorkingLits />
            <WithBorder type='bottom' />
            <WithPadding >
                <WithBorder type='all' >
                    <HeaderFilters />
                    <div
                        className={classes.tableContainer}
                    >
                        <TableComponent>
                            <>
                                <RenderHeader
                                    createSortHandler={() => { }}
                                    order='asc'
                                    orderBy='desc'
                                    rowsHeader={columns}
                                />
                                <RenderRows
                                    headerData={columns}
                                    rowsData={tableData}
                                />
                            </>
                        </TableComponent>
                    </div>
                    <Pagination
                        loading={loading}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        page={page}
                        rowsPerPage={pageSize}
                        totalPerPage={tableData?.length}
                    />
                </WithBorder>
            </WithPadding>
        </Paper>
    )
}

export default Table
