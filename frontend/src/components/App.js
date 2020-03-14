import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import MenuContainer from "./menu/MenuContainer";
import AnagramContainer from "./anagram/AnagramContainer";

import SuperStore from "../state/SuperStore";
import AnagramStore from "../state/AnagramStore";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            panel: 'MENU',
        }
    }

    componentDidMount() {
        SuperStore.onStateToAnagramGame(_ => {
           this.setState({
               panel: 'ANAGRAM'
           });
        });

        SuperStore.onStateToMenu(_ => {
            this.setState({
                panel: 'MENU'
            })
        })
    }

    componentWillUnmount() {
        SuperStore.closeAllListeners();
    }

    render() {
        return (
            <View style={styles.container}>
                { this.state.panel === 'MENU' && <MenuContainer/> }
                { this.state.panel === 'ANAGRAM' && <AnagramContainer/> }
            </View>
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
