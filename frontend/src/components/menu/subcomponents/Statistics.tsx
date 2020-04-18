import React, { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import GameBrowser from './GameBrowser';

import NameDisplay from './NameDisplay';

export default function Statistics() {
    return (
        <Fragment>
            <NameDisplay/>
            <View style={ styles.container }>
                <GameBrowser
                    key='reduced'
                    reduced={ false }
                    style={ styles.game_browser }
                />
            </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    game_browser: {
        flex: 1
    }
});