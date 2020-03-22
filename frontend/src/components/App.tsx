import React, { Component, Fragment } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import MenuContainer from "./menu/MenuContainer";
import AnagramContainer from "./anagram/AnagramContainer";

import SuperStore, { State } from "../state/SuperStore";
import AnagramStore from "../state/AnagramStore";

export default class App extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            panel: State.MENU,
        }
    }

    componentDidMount() {
        for (const state of Object.values(State)) {
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
                    { this.state.panel === State.MENU && <MenuContainer/> }
                    { this.state.panel === State.ANAGRAM_GAME && <AnagramContainer/> }
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
