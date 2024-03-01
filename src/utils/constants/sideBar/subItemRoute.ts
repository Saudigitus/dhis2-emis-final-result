import { SideBarDataRouteProps } from "../../../types/utils/ConstantsTypes";

export const subItemRoute = ({location, sectionType, filterDataElements, removeParams} : SideBarDataRouteProps) => {
    let newLocation : string
    if (location.includes(`sectionType=${sectionType}`) && !removeParams)
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