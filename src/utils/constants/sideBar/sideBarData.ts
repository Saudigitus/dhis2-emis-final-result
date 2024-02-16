import gauge from "../../../assets/images/sidebar/gauge.svg"
import fileDocument from "../../../assets/images/sidebar/file-document.svg"
import glyph from "../../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../../assets/images/sidebar/listAdd.svg"
import logOut from "../../../assets/images/sidebar/log-out.svg"
import userGroup from "../../../assets/images/sidebar/user-group.svg"
import { type SideBarItemProps } from "../../../types/sideBar/SideBarTypes"
import { handleSideBarPathChange } from "./handleSideBarPathChange"

function sideBarData(locationParms : string): SideBarItemProps[] {

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
                    route: handleSideBarPathChange(locationParms, `enrollment`, "student"), 
                    pathName: "/enrollment"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Attendance",
                    route: handleSideBarPathChange(locationParms, `attendance`, "student"),
                    pathName: "/attendance"
                },
                {
                    icon: fileDocument,
                    label: "Performance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Performance",
                    route: handleSideBarPathChange(locationParms, `performance`, "student"),
                    pathName: "/performance"
                },
                {
                    icon: gauge,
                    label: "Final result",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Final-Result",
                    route: handleSideBarPathChange(locationParms, `final-result`, "student"),
                    pathName: "/final-result"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Student-Transfer",
                    route: handleSideBarPathChange(locationParms, "student-transfer", "student"),
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
                    route: handleSideBarPathChange(locationParms, `enrollment-teacher`, "staff"),
                    pathName: "/enrollment-teacher"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Attendance-Staff",
                    route: handleSideBarPathChange(locationParms, `staff-attendance`, "staff"),
                    pathName: "/staff-attendance"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Staff-Transfer",
                    route: handleSideBarPathChange(locationParms, "staff-transfer", "staff"),
                    pathName: "/staff-transfer"
                }
            ]
        }
    ]
}
export { sideBarData }
