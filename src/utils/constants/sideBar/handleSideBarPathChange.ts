export const handleSideBarPathChange = (locationParms:string,newPath: string, sectionType: string) => {
    if (locationParms.includes(sectionType))
        return newPath + locationParms;
    else 
        return newPath + `?sectionType=${sectionType}`;
};