import React from 'react'
import Item from './Item';
import { useRecoilValue } from 'recoil';
import { ProgramConfigState } from '../../../schema/programSchema';
import { formatResponseHeader } from '../../../utils/events/formatResponseEvents';
import { getSelectedKey } from '../../../utils/commons/dataStore/getSelectedKey';
import { MenuItemContainerProps } from '../../../types/menu/MenuItemTypes';

function MenuItemContainer(props: MenuItemContainerProps ): React.ReactElement {
    const { dataElementId, onToggle } = props
    const programConfigState = useRecoilValue(ProgramConfigState)
    const { getDataStoreData } = getSelectedKey()

    const options = formatResponseHeader(programConfigState, getDataStoreData)?.find(element => element.id === dataElementId)?.options?.optionSet?.options ?? [];

    return (
        <Item onToggle={onToggle} dataElementId={dataElementId} menuItems={options} />
    )
}
export default MenuItemContainer
