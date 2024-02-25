import React from 'react'
import { MenuItem, Help } from "@dhis2/ui"
import { useRecoilValue } from 'recoil';
import { OuQueryString } from '../../../../../schema/headerSearchInputSchema';
import { PrintButtonItemOptionType, PrintButtonItemProps } from '../../../../../types/table/EnrollmentActionProps';

export default function Item(props: PrintButtonItemProps): React.ReactElement {
    const {  options } = props;
    const stringQuery = useRecoilValue(OuQueryString);
    
    const filteredOptions = stringQuery
    ? options.filter((item: any) => item.label.toLowerCase().includes(stringQuery.toLowerCase()))
    : options;

    const onChange = () => { }
    
    if ((stringQuery && !filteredOptions.length) || !options.length) {
        return <Help>
            No items found
        </Help>
    }

    return (
        <>
            {
                filteredOptions?.map((option : PrintButtonItemOptionType) => (
                    < MenuItem onClick={() => { onChange() }} key={option.value} label={option.label} />
                ))
            }
        </>
    )
}
