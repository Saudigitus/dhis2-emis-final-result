import React from 'react'
import { TextField } from '@material-ui/core';
import { TextFilterProps } from '../../../../../../../types/table/ContentFiltersTypes';

function TextFilter(props: TextFilterProps) {
    const { value, onChange, id } = props;

    return (
        <div>
            <TextField
                value={value}
                onChange={(e: any) => {
                    onChange(e.target.value, id)
                }}
                placeholder={"Digitar texto"}
            />
        </div>
    )
}

export default TextFilter
