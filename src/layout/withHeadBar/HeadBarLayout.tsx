import React from 'react'
import style from "../Layout.module.css"
import { MainHeader } from '../../components'
import { useParams } from '../../hooks/commons/useQueryParams';
import InfoPage from '../../components/info/InfoPage';

export default function HeadBarLayout({ children }: { children: React.ReactNode }): React.ReactElement {
    const { urlParamiters } = useParams();

    return (
        <div className={style.HeadBarLayoutContainer}>
            <MainHeader />
            <main className={style.MainContentContainer}>{
                (urlParamiters().school != null) ? children : <InfoPage />
            }</main>
        </div>
    )
}
