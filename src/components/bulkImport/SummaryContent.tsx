import React, { useState } from 'react';
import {
    DataTable,
    DataTableHead,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableRow
} from '@dhis2/ui'
import { ErrorDetailsTable } from "./ErrorDetailsTable";
import { useHeader } from '../../hooks';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';

interface SummaryRowProps {
    data: any
    reference: string
    expandedRows: any[]
    expandedToggle: any
    showErrorsOrConflicts: boolean
    // hasConflicts?: boolean
}

export const SummaryRow = (props: SummaryRowProps): React.ReactElement => {
    const {
        data,
        reference,
        expandedRows,
        expandedToggle,
        showErrorsOrConflicts
    } = props
    const { getDataStoreData } = getSelectedKey()

    const { columns } = useHeader()
    const { registration, "final-result": finalResult } = getDataStoreData

    // const rowHasErrors = data?.errors !== undefined
    // const showPaddingCell = showErrorsOrConflicts && !rowHasErrors
    return showErrorsOrConflicts
        ? (
            <DataTableRow
                expanded={expandedRows.includes(reference)}
                onExpandToggle={() => expandedToggle(`${reference}`)}
                expandableContent={<ErrorDetailsTable errors={data?.errors} data={data} />}
            >
                {/* {showErrorsOrConflicts && <DataTableCell/>} */}
                <DataTableCell>{data?.trackedEntity}</DataTableCell>
                <DataTableCell>{data?.orgUnit}</DataTableCell>
                <DataTableCell>{data?.event}</DataTableCell>
            </DataTableRow>
        )
        : (
            <DataTableRow>
                {/* <DataTableCell>{data?.trackedEntity}</DataTableCell>
                <DataTableCell>{data?.orgUnit}</DataTableCell>
                <DataTableCell>{data?.event}</DataTableCell> */}

                {columns.filter((a) => a.visible).map((c) => {
                    if (
                        [
                            registration.grade,
                            registration.section
                        ].includes(c.id)
                    ) {
                        return (
                            <DataTableCell key={c.id}>
                                {
                                    data[
                                    `${registration.programStage}.${c.key}`
                                    ]
                                }
                            </DataTableCell>
                        )
                    }
                    if (c.id === finalResult.status) {
                        return (
                            <DataTableCell key={c.id}>
                                {
                                    data[
                                    `${finalResult.programStage}.${c.key}`
                                    ]
                                }
                            </DataTableCell>
                        )
                    }
                    return (
                        < DataTableCell key={c.id} > {data[c.id]}</DataTableCell>
                    )
                })}
            </DataTableRow >
        )
}

interface SummaryTableProps {
    displayData?: Array<Record<string, any>>
    // mandatoryFields?: any[]
    showErrorsOrConflicts: boolean
    activeTab: string
}

export const SummaryTable = (props: SummaryTableProps): React.ReactElement => {
    const {
        displayData,
        showErrorsOrConflicts,
        activeTab
    } = props

    const { columns } = useHeader()
    const [expandedRows, setExpandedRows] = useState<string[]>([])
    const recordsName = activeTab === "new" ? "new students" : activeTab
    const expandedToggle = (rowId: string) => {
        if (expandedRows.includes(rowId)) {
            setExpandedRows(expandedRows.filter((row) => row !== rowId))
        } else {
            setExpandedRows([...expandedRows, rowId])
        }
    }
    return (
        <DataTable>
            <DataTableHead>
                <DataTableRow>
                    {(showErrorsOrConflicts && ["invalids", "conflicts"].includes(activeTab)) && <DataTableColumnHeader />}
                    {columns.filter((a) => a.visible).map((c) => <DataTableColumnHeader key={c.id}>{c.labelName}</DataTableColumnHeader>)}
                    {/* <DataTableColumnHeader>Student ID</DataTableColumnHeader>
                    <DataTableColumnHeader>School ID</DataTableColumnHeader>
                    <DataTableColumnHeader>Event ID</DataTableColumnHeader> */}
                </DataTableRow>
            </DataTableHead>
            <DataTableBody>
                {
                    ((displayData?.length ?? 0) > 0) && displayData?.map(student => (
                        <SummaryRow
                            key={`student-${student.ref}-${student?.trackedEntity ?? ""}`}
                            reference={`student-${student.ref}-${student?.trackedEntity ?? ""}`}
                            data={student}
                            expandedRows={expandedRows}
                            expandedToggle={expandedToggle}
                            showErrorsOrConflicts={showErrorsOrConflicts}
                        />
                    ))
                }
                {(displayData?.length === 0) &&
                    <DataTableRow>
                        <DataTableCell>{`No ${recordsName} to display!`}</DataTableCell>
                    </DataTableRow>
                }
            </DataTableBody>
        </DataTable>
    )
}