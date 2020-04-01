import React, { Fragment } from 'react';
import { Button, StyleSheet, View } from 'react-native';


import NameDisplay from './NameDisplay';
import Challenger from './Challenger';
import GameBrowser from './GameBrowser';

export default function Play() {
    return (
        <Fragment>
            <NameDisplay/>
            <View style={styles.container}>
                <Challenger style={styles.challenger}/>
                <GameBrowser
                    key='reduced'
                    reduced={true}
                    style={styles.game_browser}
                />
            </View>

        </Fragment>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },

    game_browser: {
        flex: 1,
    },

    challenger: {
        flex: 2,
    }
});