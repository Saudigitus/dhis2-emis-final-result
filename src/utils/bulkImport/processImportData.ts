import {fromPairs} from "./validateTemplate";
import {TemplateData} from "../../types/bulkImport/Interfaces";
import {ProgramConfig} from "../../types/programConfig/ProgramConfig";

/**
 * Generate an array of Record<string, any> objects using supplied headers as the keys for each field
 * @param headers - the headers to use as keys for each record
 * @param data - an array of data from template
 * @return - an array of Record<string, any> objects
 */
export const generateData = (headers: string[], data: any[]): TemplateData => {
    return data.map((d) => fromPairs(
        d.map((v: any, idx: number) => [headers[idx], v]))
    )
}

export const getFinalResultDataFromTemplate = (
    objects: TemplateData,
    finalResultStage: string[],
    programConfig: ProgramConfig
): TemplateData => {
    return objects.map(obj => {
        // Create a new object with 'event' and 'trackedEntity'
        const filteredObj: Record<string, any> = {
            orgUnit: obj.orgUnit,
            event: obj.event,
            enrollment: obj.enrollment,
            trackedEntity: obj.trackedEntity,
            occurredAt: obj.occurredAt,
            program: programConfig.id
        };

        // Iterate over the keys of the object
        Object.keys(obj).forEach(key => {
            // Check if the key contains any of the matchStrings
            if (finalResultStage.some(match => key.includes(match))) {
                filteredObj[key] = obj[key];
                const programStage = key.split('.')[0];
                if (!(programStage in filteredObj)) {
                    filteredObj.programStage = programStage;
                }
            }
        });

        return filteredObj;
    });
}

function transformToDataValues(input: Record<string, any>): Array<{ dataElement: string, value: string }> {
    return Object.entries(input).flatMap(([key, value]) => {
        const parts = key.split('.');
        if (parts.length === 2) {
            return {
                dataElement: parts[1],
                value
            };
        }
        return [];
    });
}

export const createUpdatePayload = (
    records: TemplateData
): Array<Record<string, any>> => {
    const events: Array<Record<string, any>> = []
    records.forEach((a) => {
        const {
            event, orgUnit, occurredAt,
            enrollment, trackedEntity,
            program, programStage, ...rest
        } = a
        const dataValues = transformToDataValues(rest)

        let currentEvent: Record<string, any> = {
            enrollment,
            trackedEntity,
            orgUnit,
            programStage,
            program,
            occurredAt
        }
        if (event !== undefined || event !== "") {
            currentEvent = { ...currentEvent, event}
            events.push({...currentEvent, dataValues})
        }
    })
    return events
}