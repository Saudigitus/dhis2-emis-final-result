import React, { useEffect } from 'react'
import HeaderItem from './HeaderItem'
import { useRecoilValue } from 'recoil'
import style from "./mainHeader.module.css"
import { useQueryParams } from '../../../hooks'
import { ProgramConfigState } from '../../../schema/programSchema'
import { headBarData } from '../../../utils/constants/headBar/headBarData'
import { ProgramConfig } from '../../../types/programConfig/ProgramConfig'
import { getSelectedKey } from '../../../utils/commons/dataStore/getSelectedKey'
import { programStageDataElements } from '../../../types/programStageConfig/ProgramStageConfig'
import { initializeRulesEngine } from '../../../hooks/programRules/rules-engine/InitializeRulesEngine'

export default function MainHeader(): React.ReactElement {
    const { urlParamiters } = useQueryParams();
    const selectedOptions = urlParamiters();
    const { getDataStoreData } = getSelectedKey()
    const programConfig: ProgramConfig = useRecoilValue(ProgramConfigState)
    const programStageDataElements: programStageDataElements[] | any = programConfig?.programStages?.find((programStage: any) => programStage.id === getDataStoreData.registration.programStage)?.programStageDataElements
    const { initialize } = initializeRulesEngine()

    useEffect(() => {
        initialize()
    }, [])

    return (
        <nav className={style.MainHeaderContainer}>
            {headBarData({ selectedOptions, getDataStoreData, programStageDataElements }).map(headerItem => (
                <HeaderItem key={headerItem.id} id={headerItem.id} dataElementId={headerItem.dataElementId} component={headerItem.component} placeholder={headerItem.placeholder} label={headerItem.label} value={headerItem.value} selected={headerItem.selected} />
            ))}
        </nav>
    )
}
