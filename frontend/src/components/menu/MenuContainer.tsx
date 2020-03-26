import React, { Component, Fragment } from 'react';
import {Button, StyleSheet, View} from 'react-native';

import NameDisplay from './subcomponents/NameDisplay';
import Challenger  from './subcomponents/Challenger';
import GameBrowser from './subcomponents/GameBrowser';
import NameChanger from './subcomponents/NameChanger';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function Settings() {
    return (
        <Fragment>
            <NameDisplay/>
            <NameChanger/>
        </Fragment>
    )
}

// @ts-ignore
function AnagramMenu({ navigation }) {
    return (
        <Fragment>
            <NameDisplay/>
            <Challenger style={styles.challenger}/>
            <GameBrowser style={styles.game_browser}/>
            <View style={styles.settings}>
                <Button title='Settings' onPress={() => navigation.navigate('Settings')}/>
            </View>
        </Fragment>
    )
}

export default class Menu extends Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='Play' component={AnagramMenu}/>
                    <Stack.Screen name='Settings' component={Settings}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
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