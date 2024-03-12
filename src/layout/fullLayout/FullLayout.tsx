import React, { useEffect } from 'react';
import style from "../layout.module.css";
import InfoPage from '../../components/info/InfoPage';
import { MainHeader, SideBar } from '../../components';
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { getDataStoreKeys } from '../../utils/commons/dataStore/getDataStoreKeys';
import { useQueryParams, useGetInitialValues, useGetProgramConfig } from '../../hooks';

export default function FullLayout({ children }: { children: React.ReactNode }) {
    const { useQuery, add } = useQueryParams();
    const school = useQuery().get("school");
    const academicYear = useQuery().get("academicYear");
    const { isSetSectionType } = useGetInitialValues();
    const { program, currentAcademicYear } = getDataStoreKeys()
    const { loading } = useGetProgramConfig(program);

    useEffect(() => {
        if ((academicYear === null || academicYear === undefined) || (typeof academicYear === "string" && academicYear?.length === 0)) {
            add("academicYear", currentAcademicYear)
        }
    }, [academicYear])

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
