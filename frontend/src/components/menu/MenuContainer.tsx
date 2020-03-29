import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Anagram from 'lib/Anagram';
import AnagramStore from 'state/AnagramStore';
import SuperStore, { SuperState } from 'state/SuperStore';
import RootNavigator from 'state/RootNavigator';

import GamePortal from './subcomponents/GamePortal';
import AnagramMenu from './subcomponents/Play';
import Settings from './subcomponents/Settings';

export type RootStackParamList = {
    Play: undefined;
    Settings: undefined;
    Anagram: { game: Anagram };
};

const Stack = createStackNavigator<RootStackParamList>();

export default class Menu extends Component<any, any> {
    componentDidMount(): void {
        RootNavigator.mountNavigator();
    }

    render() {
        return (
            <NavigationContainer
                ref={RootNavigator.navigationRef}
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