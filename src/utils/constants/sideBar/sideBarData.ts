import gauge from "../../../assets/images/sidebar/gauge.svg"
import fileDocument from "../../../assets/images/sidebar/file-document.svg"
import glyph from "../../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../../assets/images/sidebar/listAdd.svg"
import logOut from "../../../assets/images/sidebar/log-out.svg"
import userGroup from "../../../assets/images/sidebar/user-group.svg"
import { type SideBarItemProps } from "../../../types/sideBar/SideBarTypes"

function clearSearchParams(locationParms: string, sectionType?: string): string {
    return locationParms.replace(/[?&]sectionType=(student|staff)/g, `?sectionType=${sectionType}`);
}

function manipulateUrlParams(locationParms: string, newSectionType: string): string {
    // Verifica se estamos mudando de seção
    const currentSectionType = locationParms.includes('sectionType=student') ? 'student' : 'staff';
    const isChangingSection = currentSectionType !== newSectionType;

    // Se estivermos mudando de seção, retorna os parâmetros atualizados
    // Caso contrário, mantém os parâmetros existentes
    if (isChangingSection) {
        return `?sectionType=${newSectionType}`;
    } else {
        return locationParms;
    }
}


function sideBarData(currentAcademicYear : string, locationParms : string): SideBarItemProps[] {

    // Verifica se estamos mudando para uma seção diferente
    // const isChangingSection = (newPath: string) => {
    //     return !locationParms.includes('sectionType') && newPath.includes('sectionType');
    // };

    const isChangingSection = (newPath: string, sectionType?: string) => {
        // Verifica se a URL atual não contém "sectionType" e o novo caminho contém "sectionType"
        const hasCurrentSection = locationParms.includes(sectionType);
        const hasNewSection = newPath.includes(sectionType);
        return hasNewSection && !hasCurrentSection;
    };

    
    const handlePathChange = (newPath: string, sectionType?: string) => {
        console.log(newPath, 23)
        if (isChangingSection(newPath, sectionType)) {
            // Se estamos mudando para uma nova seção, limpamos os parâmetros da URL
            return newPath;
        } else {
            // Se estamos dentro da mesma seção, mantemos os parâmetros existentes
            return newPath + locationParms;
        }
    };


    return [
        {
            title: "Students",
            subItems: [
                {
                    icon: listAdd,
                    label: "Enrollment",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Enrollment",
                    route: manipulateUrlParams(`enrollment`, "student"),
                    // route: clearSearchParams(handlePathChange(`enrollment`), "student"),
                    pathName: "/enrollment"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Attendance",
                    route: clearSearchParams(handlePathChange(`attendance`, "student"), "student"),
                    pathName: "/attendance"
                },
                {
                    icon: fileDocument,
                    label: "Performance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Performance",
                    route: clearSearchParams(handlePathChange(`performance`), "student"),
                    pathName: "/performance"
                },
                {
                    icon: gauge,
                    label: "Final result",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Final-Result",
                    route: clearSearchParams(handlePathChange(`final-result`), "student"),
                    pathName: "/final-result"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Student-Transfer",
                    route: clearSearchParams(handlePathChange("student-transfer"), "student"),
                    pathName: "/student-transfer"
                }
            ]
        },
        {
            title: "Staff",
            subItems: [
                {
                    icon: userGroup,
                    label: "Staff registry",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Enrollment-Staff",
                    route: clearSearchParams(handlePathChange(`enrollment-teacher`), "staff"),
                    pathName: "/enrollment-teacher"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Attendance-Staff",
                    route:  manipulateUrlParams(`staff-attendance`, "staff"),
                    // route: clearSearchParams(handlePathChange(`staff-attendance`), "staff"),
                    pathName: "/staff-attendance"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Staff-Transfer",
                    route: clearSearchParams(handlePathChange("staff-transfer"), "staff"),
                    pathName: "/staff-transfer"
                }
            ]
        }
    ]
}
export { sideBarData }
