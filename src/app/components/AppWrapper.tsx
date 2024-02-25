import React from 'react'
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { useDataStore } from '../../hooks'
import { AppProps } from '../../types/app/AppTypes';
import { useGetPrintTemplates } from '../../hooks/printTemplates/useGetPrintTemplates';

export default function AppWrapper(props: AppProps) {
    const { error, loading } = useDataStore()
    const { } = useGetPrintTemplates()

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error != null) {
        return (
            <CenteredContent>
                Something went wrong wen loading the app, please check if you app is already configured
            </CenteredContent>
        )
    }

    return (
        <>{props.children}</>
    )
}
