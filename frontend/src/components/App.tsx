import React, { Component, Fragment } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import MenuContainer from "./menu/MenuContainer";
import AnagramContainer from "./anagram/AnagramContainer";

import SuperStore, { SuperState } from "../state/SuperStore";

export default class App extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            panel: SuperState.MENU,
        }
    }

    componentDidMount() {
        for (const state of Object.values(SuperState)) {
            SuperStore.onSetState(state, () => {
               this.setState({
                   panel: state
               });
            });
        }
    }

    componentWillUnmount() {
        SuperStore.closeAllListeners();
    }

    render() {
        return (
            <Fragment>
                <View style={styles.container}>
                    { this.state.panel === SuperState.MENU && <MenuContainer/> }
                    { this.state.panel === SuperState.ANAGRAM_GAME && <AnagramContainer/> }
                </View>
            </Fragment>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
