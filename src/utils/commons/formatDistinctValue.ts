export const reducer = (array: any[], lastYearDataElements: any[]) => {
    return array.reduce(function (r, a) {
        r[a.programStage] = (r[a.programStage]) || [];
        if (a.id && a.assignedValue) {
            r[a.programStage].push({ dataElement: a.id, value: a.assignedValue });
        }else if(lastYearDataElements?.find(item => item.dataElement === a.id)){
            r[a.programStage].push({ dataElement: a?.id, value: lastYearDataElements?.find(item => item?.dataElement === a.id)?.value });
        }
        return r;
    }, Object.create(null));
}