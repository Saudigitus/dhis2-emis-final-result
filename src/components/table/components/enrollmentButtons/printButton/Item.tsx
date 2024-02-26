import React from 'react'
import { useRecoilValue } from 'recoil';
import { MenuItem, Help } from "@dhis2/ui"
import style from "./printButton.module.css"
import { useConfig } from '@dhis2/app-runtime';
import { OuQueryString } from '../../../../../schema/headerSearchInputSchema';
import { PrintButtonItemProps } from '../../../../../types/table/EnrollmentActionProps';
import { PrintTemplateConfig } from '../../../../../types/printTemplate/PrintTemplateConfig';
import { RowSelectionState } from '../../../../../schema/tableSelectedRowsSchema';

export default function Item(props: PrintButtonItemProps): React.ReactElement {
    const {  options } = props;
    const { baseUrl } = useConfig()  
    const stringQuery = useRecoilValue(OuQueryString);
    const selectedTeis = useRecoilValue(RowSelectionState)

    const filteredOptions = stringQuery
    ? options.filter((item: any) => item.name.toLowerCase().includes(stringQuery.toLowerCase()))
    : options;
    
    if ((stringQuery && !filteredOptions.length) || !options.length) {
        return <Help>
            No items found
        </Help>
    }

    return (
        <>
            {
                filteredOptions?.map((option : PrintTemplateConfig) => (
                    <a
                        className={style.itemLink}
                        target='_blank'
                        href={`${baseUrl}/#/printer?tei=${selectedTeis.selectedRows.map((tei : any) => tei.event).join(';')}&program=${option.program}&templateId=${option.id}`}
                    >
                        < MenuItem key={option.id} label={option.name} />
                    </a>
                ))
            }
        </>
    )
}
