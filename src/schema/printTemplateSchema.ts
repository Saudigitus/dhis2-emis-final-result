import { atom } from "recoil"
import { PrintTemplateConfig } from "../types/printTemplate/PrintTemplateConfig"

export const PrintTemplateState = atom<PrintTemplateConfig[]>({
    key: "printTemplate-get-state",
    default: []
})