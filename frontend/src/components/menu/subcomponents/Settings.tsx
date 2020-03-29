import React, {Fragment} from 'react';
import NameDisplay from 'components/menu/subcomponents/NameDisplay';
import NameChanger from 'components/menu/subcomponents/NameChanger';

export default function Settings() {
    return (
        <Fragment>
            <NameDisplay/>
            <NameChanger/>
        </Fragment>

    )
}
