import { headBarDataElements } from "./headBarDataElements"
import { type HeadBarTypes } from "../../../types/headBar/HeadBarTypes"
import { HeadBarDataProps } from "../../../types/utils/ConstantsTypes"

function headBarData({selectedOptions, getDataStoreData, programStageDataElements }: HeadBarDataProps): HeadBarTypes[] {
    return [
        {
            id: "c540ac7c",
            label: "School",
            value: selectedOptions?.schoolName ?? "Select a school",
            placeholder: "Search for organisation unit",
            component: "orgUnitTree",
            selected: selectedOptions?.schoolName ? true : false,
        },
        ...headBarDataElements({selectedOptions: selectedOptions, getDataStoreData:getDataStoreData, programStageDataElements:programStageDataElements}),
        {
            id: "j2e9b216",
            label: "Academic Year",
            value: selectedOptions?.academicYear ?? "Select academic year",
            placeholder: "Search for academic year",
            dataElementId: getDataStoreData?.registration?.academicYear,
            component: "menuItemContainer",
            selected: selectedOptions?.academicYear ? true : false,
        }
    ]
}
export { headBarData }
