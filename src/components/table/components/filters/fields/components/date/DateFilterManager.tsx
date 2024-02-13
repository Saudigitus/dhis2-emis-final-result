import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { DateFilterManagerProps } from '../../../../../../../types/table/components/filter/fields/DateTypes';

const getStyles = makeStyles(() => ({
    fromToContainer: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    inputContainer: {},
    toLabelContainer: {
        width: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0
    },
    logicErrorContainer: {
        paddingTop: 0
    },
    datePicker: {
        width: '150px'
    }
}));

const DateFilterManager = (props: DateFilterManagerProps) => {
    const { onChange, value = { startDate: "", endDate: "" }, id } = props;
    const classes = getStyles();

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div className={classes.fromToContainer}>
                <div className={classes.inputContainer}>
                    <KeyboardDatePicker
                        // disableToolbar
                        variant="inline"
                        format="yyyy/MM/dd"
                        className={classes.datePicker}
                        label={"From"}
                        maxDate={value?.endDate}
                        value={(value?.startDate?.length > 0) ? value?.startDate : null}
                        onChange={(e) => { onChange(e, id, "DATE", "start"); }}
                    />
                </div>
                <div className={classes.toLabelContainer} />
                <div className={classes.inputContainer}>
                    <KeyboardDatePicker
                        // disableToolbar
                        variant="inline"
                        format="yyyy/MM/dd"
                        className={classes.datePicker}
                        minDate={value?.startDate}
                        label={"To"}
                        value={((value?.endDate)?.length > 0) ? value?.endDate : null}
                        onChange={(e) => { onChange(e, id, "DATE", "end"); }}
                    />
                </div>
            </div>
        </MuiPickersUtilsProvider>

    );
}

export default DateFilterManager
