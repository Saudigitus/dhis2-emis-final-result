import React from 'react';
import { AppProps } from '../../types/app/AppTypes';

export default function AppConfigurations(props: AppProps) {
    return (
        <>{props.children}</>
    )
}
