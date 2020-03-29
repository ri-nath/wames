import React, { Fragment } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../MenuContainer';

import NameDisplay from './NameDisplay';
import Challenger from './Challenger';
import GameBrowser from './GameBrowser';

import RootNavigator from 'state/RootNavigator';

export default function AnagramMenu() {
    return (
        <Fragment>
            <NameDisplay/>
            <Challenger style={styles.challenger}/>
            <GameBrowser style={styles.game_browser}/>
            <View style={styles.settings}>
                <Button title='Settings' onPress={() => RootNavigator.navigate('Settings')}/>
            </View>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    settings: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    game_browser: {
        flex: 2,
    },

    challenger: {
        flex: 1,
    }
});