import { filterDataElements } from "../../../types/dataStore/DataStoreConfig";

export const subItemRoute = (location:string, sectionType: string, filterDataElements : filterDataElements[]) => {
    let newLocation : string

    if (location.includes(`sectionType=${sectionType}`))
        newLocation = location;
    
    else {
        newLocation = location.replace(/(student|staff)/g, sectionType);
        filterDataElements.forEach( filter =>  newLocation = removeQueryParam(newLocation, filter.code));
    }

    return newLocation.toString();
};

function removeQueryParam(queryString: string, paramToRemove: string) {
    const queryParams = new URLSearchParams(queryString);

    queryParams.delete(paramToRemove);

    return queryParams.toString();
}