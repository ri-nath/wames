import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { asyncRequestData } from 'store/actions';
import { AppState, State } from 'ts';
import RootNavigator from '../store/RootNavigator';
import AnagramContainer from './anagram/AnagramContainer';
import MenuContainer from './menu/MenuContainer';

type Props = {
    state: AppState['state'],
    dispatch: any,
}

const RootStack = createStackNavigator();

function Loading() {
    return (
        <View style={ styles.container }>
            <Text>Connecting to Server...</Text>
            <ActivityIndicator size='large'/>
        </View>
    );
}


class App extends Component<Props, any> {
    componentDidMount(): void {
        RootNavigator.mountNavigator();
        this.props.dispatch(asyncRequestData());
    }

    componentWillUnmount(): void {
        RootNavigator.unmountNavigator();
    }

    render() {
        return (
            <NavigationContainer
                ref={ RootNavigator.navigationRef }
                onStateChange={ RootNavigator.onStateChange }
            >
                <RootStack.Navigator
                    mode="modal"
                    screenOptions={ { headerShown: false } }
                >
                    <RootStack.Screen name="Loading" component={ Loading }/>
                    <RootStack.Screen name="Menu" component={ MenuContainer }/>
                    <RootStack.Screen name="Anagram Game" component={ AnagramContainer }/>
                </RootStack.Navigator>
            </NavigationContainer>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        state: state.app.state
    };
}

export default connect(mapStateToProps)(App);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
