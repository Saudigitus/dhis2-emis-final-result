import { Navigate } from "react-router-dom";
import React from "react";
import { SimpleLayout, FullLayout } from "../../layout"
import { TableComponent } from "../../pages";

export default function RouteList() {
    return [
        {
            path: "/",
            layout: SimpleLayout,
            component: () => <Navigate to="/final-result" replace />
        },
        {
            path: "/final-result",
            layout: FullLayout,
            component: () => <TableComponent />
        },
        {
            path: "/enrollment",
            layout: FullLayout,
            component: () => <TableComponent />
        },
        {
            path: "/attendance",
            layout: FullLayout,
            component: () => <TableComponent />
        },
        {
            path: "/performance",
            layout: FullLayout,
            component: () => <TableComponent />
        },
        {
            path: "/staff-attendance",
            layout: FullLayout,
            component: () => <TableComponent />
        }


    ]
}
