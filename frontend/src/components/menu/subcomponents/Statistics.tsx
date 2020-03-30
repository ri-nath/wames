import React from 'react';
import { StyleSheet, View } from 'react-native';


import NameDisplay from './NameDisplay';
import GameBrowser from './GameBrowser';


export default function Statistics() {
    return (
        <View style={styles.container}>
            <NameDisplay/>
            <GameBrowser
                key='raw'
                reduced={false}
                style={styles.game_browser}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    game_browser: {
        flex: 1,
    }
});