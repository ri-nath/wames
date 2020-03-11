import React from 'react';
import { StyleSheet, View } from 'react-native';

import Game from './game/Game';

export default function App() {
    return (
        <View style={styles.score}>
            <Game/>
        </View>
    );
}

const styles = StyleSheet.create({
    score: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
