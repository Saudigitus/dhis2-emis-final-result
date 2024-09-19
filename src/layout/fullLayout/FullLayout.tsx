import React, { useEffect } from 'react';
import style from "../layout.module.css";
import InfoPage from '../../components/info/InfoPage';
import { MainHeader, SideBar } from '../../components';
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useGetInitialValues, useGetProgramConfig, useQueryParams } from '../../hooks';
import { getDataStoreKeys } from '../../utils/commons/dataStore/getDataStoreKeys';

export default function FullLayout({ children }: { children: React.ReactNode }) {
    useGetInitialValues()
    const { urlParamiters,add } = useQueryParams()
    const { school, academicYear } = urlParamiters()
    const { isSetSectionType } = useGetInitialValues()
    const { loading } = useGetProgramConfig();
    const { currentAcademicYear } = getDataStoreKeys()

    useEffect(() => {
        if (((academicYear === null || academicYear === undefined) || (typeof academicYear === "string" && academicYear?.length === 0)) && currentAcademicYear) {
            add("academicYear", currentAcademicYear)
        }
    }, [academicYear,currentAcademicYear])

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
                        (school === null || school === undefined) ? <InfoPage /> : children
                    }
                </main>
            </div>
        </div>
    )
}
