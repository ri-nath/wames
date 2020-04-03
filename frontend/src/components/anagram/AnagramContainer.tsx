import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import Stage from './subcomponents/Stage';
import Info from './subcomponents/Info';

type Props = {
    style?: any,
}


export default function AnagramContainer(props: Props) {
         return (
             <Fragment>
                    <View style={styles.info}>
                        <Info/>
                    </View>
                    <View style={styles.stage}>
                        <Stage/>
                    </View>
            </Fragment>
         )
}

const styles = StyleSheet.create({
    info: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },

    stage: {
        flex: 2,
    }
});