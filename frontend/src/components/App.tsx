import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';

import { AppState, State } from 'store/types';
import { asyncRequestData } from 'store/actions';

import { createStackNavigator } from '@react-navigation/stack';
import MenuContainer from './menu/MenuContainer';
import AnagramContainer from './anagram/AnagramContainer';
import RootNavigator from '../lib/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';

type Props = {
    state: AppState["state"],
    dispatch: any,
}

const RootStack = createStackNavigator();

function Loading() {
    return (
        <View style={styles.container}>
            <Text>Loading...</Text>
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
                ref={RootNavigator.navigationRef}
                onStateChange={RootNavigator.onStateChange}
            >
                <RootStack.Navigator
                    mode="modal"
                    screenOptions={{ headerShown: false }}
                >
                    <RootStack.Screen name="Loading" component={Loading}/>
                    <RootStack.Screen name="Menu" component={MenuContainer}/>
                    <RootStack.Screen name="Anagram Game" component={AnagramContainer}/>
                </RootStack.Navigator>
            </NavigationContainer>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        state: state.app.state,
    }
}

export default connect(mapStateToProps)(App);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
