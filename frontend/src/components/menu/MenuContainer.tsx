import React, { Component } from 'react';
import { Icon } from 'react-native-elements';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Anagram from 'lib/Anagram';
import RootNavigator from 'state/RootNavigator';

import GamePortal from './subcomponents/GamePortal';
import AnagramMenu from './subcomponents/Play';
import Settings from './subcomponents/Settings';
import {createDrawerNavigator} from '@react-navigation/drawer';

export type RootStackParamList = {
    Menu: undefined;
    Anagram: { game: Anagram };
};

export type RootDrawerParamList = {
    Play: undefined,
    Settings: undefined
}

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

function DrawerWrapper() {
    return (
        <Drawer.Navigator
        >
            <Drawer.Screen name='Play' component={AnagramMenu}/>
            <Drawer.Screen name='Settings' component={Settings}/>
        </Drawer.Navigator>
    )
}

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
                    <Stack.Screen
                        name='Menu'
                        component={ DrawerWrapper }
                        options={{
                            headerLeft: () => (
                                <Icon
                                    raised={true}
                                    name='menu'
                                    onPress={() => RootNavigator.toggleDrawer()}
                                />
                            ),
                        }}
                    />
                    <Stack.Screen
                        name='Anagram'
                        component={GamePortal}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}