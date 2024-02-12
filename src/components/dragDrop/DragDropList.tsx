import React from 'react'
import i18n from '@dhis2/d2-i18n';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragDropListItem from './DragDropItems.js';

interface DragDropListProps {
    listItems: any[]
    handleUpdateListOrder: (list: any[]) => void
    handleToggle: (id: string) => void
}

function DragDropList(props: DragDropListProps) {
    const { listItems, handleUpdateListOrder, handleToggle } = props;

    return (
        <DndProvider backend={HTML5Backend}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={12}>{i18n.t('Column')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listItems?.map((item, i) =>
                        <DragDropListItem
                            key={item.id}
                            id={item.id}
                            text={item.header}
                            handleToggle={handleToggle}
                            visible={item.visible}
                        />
                    )}
                </TableBody>
            </Table>
        </DndProvider>
    )
}

export default DragDropList
