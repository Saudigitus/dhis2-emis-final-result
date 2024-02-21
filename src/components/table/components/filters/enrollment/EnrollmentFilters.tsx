import React from 'react'
import syles from './filter.module.css'
import ContentFilter from './ContentFilter';
import { useHeader } from '../../../../../hooks';
import { VariablesTypes } from '../../../../../types/variables/AttributeColumns';

function EnrollmentFilters(): React.ReactElement {
    const { columns } = useHeader()
    return (
        <div className={syles.enrollmentFilterContaine}>
            <ContentFilter headers={columns?.filter(column => column.type !== VariablesTypes.FinalResult)} />
        </div>
    )
}

export default EnrollmentFilters
