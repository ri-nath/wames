import React, { Component, Fragment } from 'react';
import { Button, StyleSheet, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp} from '@react-navigation/stack';

import * as RootNavigation from 'RootNavigation';
import Anagram from 'wrappers/Anagram';
import AnagramStore from 'state/AnagramStore';
import SuperStore, {SuperState} from 'state/SuperStore';

import NameDisplay from './subcomponents/NameDisplay';
import Challenger  from './subcomponents/Challenger';
import GameBrowser from './subcomponents/GameBrowser';
import NameChanger from './subcomponents/NameChanger';
import GamePortal from './subcomponents/GamePortal';
import {isMountedRef, navigationRef} from 'RootNavigation';

export type RootStackParamList = {
    Play: undefined;
    Settings: undefined;
    Anagram: { game: Anagram };
};

const Stack = createStackNavigator<RootStackParamList>();

function Settings() {
    return (
        <Fragment>
            <NameDisplay/>
            <NameChanger/>
        </Fragment>
    )
}

export type AnagramMenuNavigationProp = StackNavigationProp<RootStackParamList, 'Play'>;

type Props = {
    navigation: AnagramMenuNavigationProp
}

function AnagramMenu(props: Props) {
    return (
        <Fragment>
            <NameDisplay/>
            <Challenger style={styles.challenger}/>
            <GameBrowser style={styles.game_browser}/>
            <View style={styles.settings}>
                <Button title='Settings' onPress={() => RootNavigation.navigate('Settings')}/>
            </View>
        </Fragment>
    )
}

// @ts-ignore
const getActiveRouteName = (state: any) => {
    const route = state.routes[state.index];

    if (route.state) {
        // Dive into nested navigators
        return getActiveRouteName(route.state);
    }

    return route.name;
};

export default class Menu extends Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    componentDidMount(): void {
        isMountedRef.current = true;

        AnagramStore.onEndGame((game: Anagram) => {
            SuperStore.setState(SuperState.MENU);
            RootNavigation.navigate('Anagram', { game: game });
        });
    }

    render() {
        return (
            <NavigationContainer
                ref={navigationRef}
                onStateChange={state => console.log('State to... ', getActiveRouteName(state))}
            >
                <Stack.Navigator>
                    <Stack.Screen name='Play' component={AnagramMenu}/>
                    <Stack.Screen name='Settings' component={Settings}/>
                    <Stack.Screen name='Anagram' component={GamePortal}/>
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