import React from 'react';
import style from "../Layout.module.css";
import InfoPage from '../../components/info/InfoPage';
import { MainHeader, SideBar } from '../../components';
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { getSelectedKey } from '../../utils/commons/dataStore/getSelectedKey';
import { useQueryParams, useGetInitialValues, useGetProgramConfig } from '../../hooks';

export default function FullLayout({ children }: { children: React.ReactNode }) {
    const { useQuery } = useQueryParams();
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
