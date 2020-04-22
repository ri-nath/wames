import NameChanger from 'components/menu/subcomponents/NameChanger';
import NameDisplay from 'components/menu/subcomponents/NameDisplay';
import React, { Fragment } from 'react';

export default function Settings() {
    return (
        <Fragment>
            <NameDisplay/>
            <NameChanger/>
        </Fragment>

    );
}
