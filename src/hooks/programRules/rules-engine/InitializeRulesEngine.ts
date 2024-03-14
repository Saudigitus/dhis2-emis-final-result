import { useRecoilState } from "recoil"
import { FormattedPRulesType } from "../../../types/programRules/FormattedPRules"
import { useFormatProgramRules } from "../useFormatProgramRules"
import { getFunctionExpression, getValueTypeVariable, removeSpecialCharacters, replaceConditionVariables } from "./RulesEngine"
import { useFormatProgramRulesVariables } from "../useFormatProgramRulesVariables"
import { ProgramRulesFormatedState } from "../../../schema/programRulesFormated"
import { useHeader } from "../../tableHeader/useHeader"

export const initializeRulesEngine = () => {
    const { programRules } = useFormatProgramRules()
    const { programRulesVariables } = useFormatProgramRulesVariables()
    const [newProgramRules, setnewProgramRules] = useRecoilState(ProgramRulesFormatedState)
    const { columns } = useHeader();

    function initialize() {
        if (programRules?.length > 0 && Object.keys(programRulesVariables)?.length > 0 && newProgramRules?.length === 0) {
            const newProgramR: FormattedPRulesType[] = programRules
                .map((programRule: FormattedPRulesType) => {
                    return {
                        ...programRule,
                        functionName: getFunctionExpression(programRule.condition),
                        condition: replaceConditionVariables(removeSpecialCharacters(programRule?.condition), programRulesVariables),
                        data: replaceConditionVariables(removeSpecialCharacters(programRule?.data), programRulesVariables),
                        valueType: getValueTypeVariable(columns, programRule, "programStage")
                    }
                })
            setnewProgramRules(newProgramR)
        }
    }

    return {
        initialize
    }

}