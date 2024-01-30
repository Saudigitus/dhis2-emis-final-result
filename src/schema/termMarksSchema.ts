import { atom } from "recoil"
import { z } from "zod"

export const termMarksSchema = z.object({
    id: z.string(),
    label: z.string().optional(),
    type: z.string()
})

export const eventsSchema = z.array(z.object({}))

export type TermMarksSchema = z.infer<typeof termMarksSchema>
export type EventsSchema = z.infer<typeof eventsSchema>

export const TermMarksState = atom<TermMarksSchema>({
    key: "termMarks-state",
    default: {
        id: "",
        label: "",
        type: ""
    }
})

export const EventsState = atom<EventsSchema>({
    key: "events-state",
    default: []
})
