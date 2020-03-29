import * as React from 'react';

export const navigationRef = React.createRef();

export let isMountedRef = React.createRef();

export function navigate(name, params) {
    if (isMountedRef.current && navigationRef.current) {
        navigationRef.current.navigate(name, params);
    } else {
        console.error("Navigate to... ", name, ", not called because not mounted!")
    }
}