import { type dataStoreRecord } from "../../../types/dataStore/DataStoreConfig"
import { type SelectedOptionsTypes, type HeadBarTypes } from "../../../types/headBar/HeadBarTypes"

function headBarData(selectedOptions: SelectedOptionsTypes, getDataStoreData: dataStoreRecord): HeadBarTypes[] {
    return [
        {
            id: "c540ac7c",
            label: "School",
            value: selectedOptions?.schoolName ?? "Select a school",
            placeholder: "Search for organisation unit",
            dataElementId:"school",
            component: "orgUnitTree",
            selected: selectedOptions?.schoolName ? true : false,
        },
        {
            id: "981ed8a3",
            label: "Grade",
            value: selectedOptions?.grade ?? "Select a grade",
            placeholder: "Search for grade",
            dataElementId: getDataStoreData?.registration?.grade,
            component: "menuItemContainer",
            selected: selectedOptions?.grade ? true : false,
        },
        {
            id: "7ce5c7f3",
            label: "Class",
            value: selectedOptions?.class ?? "Select a class",
            placeholder: "Search for class",
            dataElementId: getDataStoreData?.registration?.section,
            component: "menuItemContainer",
            selected: selectedOptions?.class ? true : false,
        },
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
