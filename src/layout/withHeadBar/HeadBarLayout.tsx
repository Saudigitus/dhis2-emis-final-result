import React from 'react';
import style from "../Layout.module.css";
import { useQueryParams } from '../../hooks';
import { MainHeader } from '../../components';
import InfoPage from '../../components/info/InfoPage';

export default function HeadBarLayout({ children }: { children: React.ReactNode }): React.ReactElement {
    const { urlParamiters } = useQueryParams();

    return (
        <div className={style.HeadBarLayoutContainer}>
            <MainHeader />
            <main className={style.MainContentContainer}>{
                (urlParamiters().school != null) ? children : <InfoPage />
            }</main>
        </div>
    )
}
