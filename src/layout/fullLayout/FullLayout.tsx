import React from 'react'
import style from "../Layout.module.css"
import { MainHeader, SideBar } from '../../components'
import { useParams } from '../../hooks/commons/useQueryParams';
import InfoPage from '../../components/info/InfoPage';
import { useGetInitialValues } from '../../hooks/initialValues/useGetInitialValues';
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { useGetProgramConfig } from '../../hooks/programConfig/useGetprogramConfig';
import { CenteredContent, CircularLoader } from "@dhis2/ui";

export default function FullLayout({ children }: { children: React.ReactNode }) {
    const { useQuery } = useParams();
    const school = useQuery().get("school");
    const { isSetSectionType } = useGetInitialValues();
    const { getDataStoreData } = getSelectedKey()
    const { loading } = useGetProgramConfig(getDataStoreData?.program);

    if (!isSetSectionType) {
        return (
            <CenteredContent>
                Cant load the app without section type
            </CenteredContent>
        )
    }

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    return (
        <div className={style.LayoutContainer}>
            <SideBar />
            <div className={style.FullLayoutContainer}>
                <MainHeader />
                <main className={style.MainContentContainer}>
                    {
                        (school != null) ? children : <InfoPage />
                    }
                </main>
            </div>
        </div>
    )
}
