import React, {Fragment} from 'react';
import { StyleSheet, View, Text } from 'react-native';

import NameDisplay from './NameDisplay';
import GameBrowser from './GameBrowser';

export default function Statistics() {
    return (
        <Fragment>
            <NameDisplay/>
            <View style={styles.container}>
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
    },

    game_browser: {
        flex: 1,
    }
});