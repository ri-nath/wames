import React from 'react';
import { StyleSheet, View } from 'react-native';

import AnagramContainer from './game/AnagramContainer';

export default function App() {
    return (
        <View style={styles.container}>
            <AnagramContainer/>
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
