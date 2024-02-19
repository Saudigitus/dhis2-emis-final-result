import { useRecoilValue } from "recoil";
import { ProgramConfigState } from "../../../schema/programSchema";
import { ProgramConfig } from "../../../types/programConfig/ProgramConfig";

export const getProgramStageDataElement = () => {
    const programConfigData = useRecoilValue(ProgramConfigState);
    const programStageDataElement : any = programConfigData.programStages.flat().map((x : any) => {
        return " "
    })

    return { programStageDataElement }
}