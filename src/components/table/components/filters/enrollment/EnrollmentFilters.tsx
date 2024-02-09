import React from 'react'
import ContentFilter from './ContentFilter';
import { useHeader } from '../../../../../hooks/tableHeader/useHeader';
import { VariablesTypes } from '../../../../../types/table/AttributeColumns';
import syles from './Filter.module.css'

function EnrollmentFilters(): React.ReactElement {
    const { columns } = useHeader()
    return (
        <div className={syles.enrollmentFilterContaine}>
            <ContentFilter headers={columns?.filter(column => column.type !== VariablesTypes.FinalResult)} />
        </div>
    )
}

export default EnrollmentFilters
