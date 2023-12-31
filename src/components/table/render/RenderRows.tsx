import React from 'react'
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import { makeStyles, type Theme, createStyles } from '@material-ui/core/styles';
import { RowCell, RowTable } from '../components';
import { getDisplayName } from '../../../utils/table/rows/getDisplayNameByOption';
import { type CustomAttributeProps } from '../../../types/table/AttributeColumns';
import { Checkbox } from "@dhis2/ui"
import { useRecoilState } from 'recoil';
import { RowSelectionState } from '../../../schema/tableSelectedRowsSchema';
import { checkIsRowSelected } from '../../../utils/commons/arrayUtils';

interface RenderHeaderProps {
    rowsData: any[]
    headerData: CustomAttributeProps[]
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        row: { width: "100%" },
        dataRow: {
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#F1FBFF'
            }
        },
        cell: {
            padding: `${theme.spacing(1) / 2}px ${theme.spacing(1) * 7}px ${theme.spacing(1) /
                2}px ${theme.spacing(1) * 3}px`,
            '&:last-child': {
                paddingRight: theme.spacing(1) * 3
            },
            borderBottomColor: "rgba(224, 224, 224, 1)"
        },
        bodyCell: {
            fontSize: theme.typography.pxToRem(13),
            color: theme.palette.text.primary
        }
    })
);

function RenderRows({ headerData, rowsData }: RenderHeaderProps): React.ReactElement {
    const classes = useStyles()
    const [selected, setSelected] = useRecoilState(RowSelectionState);

    const onToggle = (rawRowData: object) => {
        setSelected({ ...selected, selectedRows: checkIsRowSelected(rawRowData, selected), isAllRowsSelected: selected.rows.length === checkIsRowSelected(rawRowData, selected).length })
    }

    if (rowsData.length === 0) {
        return (
            <RowTable
                className={classes.row}
            >
                <RowCell
                    className={classNames(classes.cell, classes.bodyCell)}
                    colspan={headerData?.filter(x => x.visible)?.length + 1}
                >
                    {i18n.t('No data to display')}
                </RowCell>
            </RowTable>
        );
    }

    return (
        <React.Fragment>
            {
                rowsData.map((row, index) => (
                    <RowTable
                        key={index}
                        className={classNames(classes.row, classes.dataRow)}
                    >
                        <RowCell
                            className={classNames(classes.cell, classes.bodyCell)}
                        >
                            <Checkbox
                                checked={selected.isAllRowsSelected || selected.selectedRows.filter(element => element.trackedEntity === row.trackedEntity).length > 0}
                                name="Ex"
                                onChange={() => { onToggle(selected.rows[index]); }}
                                value="checked"
                            />
                        </RowCell>
                        {
                            headerData?.filter(x => x.visible)?.map(column => (
                                <RowCell
                                    key={column.id}
                                    className={classNames(classes.cell, classes.bodyCell)}
                                >
                                    <div>
                                        {getDisplayName({ attribute: column.id, headers: headerData, value: row[column.id] }) || "---"}
                                    </div>
                                </RowCell>
                            ))
                        }
                    </RowTable>
                ))
            }
        </React.Fragment>
    )
}

export default RenderRows
