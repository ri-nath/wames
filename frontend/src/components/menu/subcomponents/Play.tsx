import React, { Fragment } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';


import NameDisplay from './NameDisplay';
import Challenger from './Challenger';
import GameBrowser from './GameBrowser';

export default function Play() {
    return (
        <Fragment>
            <NameDisplay/>
            <View style={styles.container}>
                <Challenger style={styles.challenger}/>
                <View style={styles.game_browser}>
                    <GameBrowser
                        key='reduced'
                        reduced={true}
                        style={styles.game_browser}
                    />
                </View>
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
        margin: 20,
    },

    challenger: {
        flex: 3,
    }
});