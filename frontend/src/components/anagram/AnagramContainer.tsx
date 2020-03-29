import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import Stage from './subcomponents/Stage';
import Info from './subcomponents/Info';

export default function AnagramContainer() {
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