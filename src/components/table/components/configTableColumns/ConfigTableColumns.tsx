import React, { useState } from 'react'
import i18n from '@dhis2/d2-i18n';
import { IconSettings24, NoticeBox } from '@dhis2/ui';
import { IconButton, Tooltip } from '@material-ui/core';
import DialogConfigColumns from './DialogConfigColumns';
import styles from "./configTableColumns.module.css"
import { RowSelectionState } from '../../../../schema/tableSelectedRowsSchema';
import { useRecoilState } from 'recoil';

interface ConfigTableColumnsProps {
    headers: any[]
    updateVariables: (list: any[]) => void
}

function ConfigTableColumns(props: ConfigTableColumnsProps) {
    const { headers, updateVariables } = props;
    const [selected] = useRecoilState(RowSelectionState);
    const [open, setopen] = useState(false)

    const closeDialog = () => {
        setopen(false)
    }

    const openDialog = () => {
        setopen(true)
    }

    // const handleSaveColumns = (columns) => {
    //     // this.props.onSave(columns);
    //     closeDialog();
    // }

    return (
        <div className={styles['config-table__columns']}>
            {
                selected.selectedRows.length > 0 && <NoticeBox title={`${selected.selectedRows.length} rows selected`} />
            }
            <Tooltip
                disableFocusListener
                disableTouchListener
                enterDelay={50}
                title={i18n.t('Select columns')}
                className="my-auto"
            >
                <IconButton
                    onClick={openDialog}
                >
                    <IconSettings24 />
                </IconButton>
            </Tooltip>
            <DialogConfigColumns
                open={open}
                onClose={closeDialog}
                // onSave={handleSaveColumns}
                updateVariables={updateVariables}
                headers={headers}
            />
        </div>
    )
}

export default ConfigTableColumns
