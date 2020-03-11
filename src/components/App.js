import React from 'react';
import { StyleSheet, View } from 'react-native';

import GameContainer from './game/GameContainer';

export default function App() {
    return (
        <View style={styles.container}>
            <GameContainer/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
