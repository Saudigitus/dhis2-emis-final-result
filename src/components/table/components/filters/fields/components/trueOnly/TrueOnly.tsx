import React from 'react';
import { withStyles } from '@material-ui/core';
import { Checkbox, spacersNum } from '@dhis2/ui';
import { TrueOnlyProps } from '../../../../../../../types/table/ContentFiltersProps';

const styles = (theme : any) => ({
    label: theme.typography.formFieldTitle,
    checkbox: {
        marginTop: spacersNum.dp8,
        marginBottom: spacersNum.dp16,
    },
});

function TrueOnly(props : TrueOnlyProps) {
    const { header, classes, id, onChange, value } = props;
    return (
        <div>
            <Checkbox
                checked={value}
                label={"Yes"}
                name={`multiSelectBoxes`}
                onChange={(e : any) => { onChange(e.checked, id); }}
                value={value}
                className={classes.checkbox}
                dense
            />
        </div>
    )
}

export default withStyles(styles)(TrueOnly)