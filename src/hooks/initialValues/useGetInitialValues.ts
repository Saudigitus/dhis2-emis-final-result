import { useSetRecoilState } from "recoil"
import { useLocation } from "react-router-dom";
import { HeaderFieldsState } from "../../schema/headersSchema"
import useDataElementsParamMapping from "../dataElements/useDataElementsParamMapping";

let localLocation: string = ""
export function useGetInitialValues() {
    const location = useLocation()
    const paramsMapping = useDataElementsParamMapping();
    const setHeaderFields = useSetRecoilState(HeaderFieldsState)
    const entries = location?.search?.split('?')?.[1]?.split('&')?.map((item) => item.split('=')).filter(x => x.length === 2)
    const dataElementsQuerybuilder = []
    let diff: number = 0

    if (entries?.length > 0) {
        for (const [key, value] of entries) {
            const keys = Object.entries(paramsMapping)
            for (const [dataElement, name] of keys) {
                if (name.includes(key)) {
                    if (!localLocation.includes(value)) {
                        diff = diff + 1
                    }
                    dataElementsQuerybuilder.push(`${dataElement}:in:${value.replace("+", " ")}`)
                }
            }
        }
        let copyValues = dataElementsQuerybuilder.filter(x=>{
            if (x.split(":in:")[1].replace(/\s/g, '').length > 0 ) {
                return x
            }
        })
            setHeaderFields({
                attributes: [],
                dataElements: copyValues
            })
    }

    localLocation = location.search.toString()
    return {
        isSetSectionType: location?.search.includes("sectionType")
    }
}
