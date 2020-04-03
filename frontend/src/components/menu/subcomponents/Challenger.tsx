import React, { Component } from 'react';
import {StyleSheet, View, TextInput, Button} from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';

import { asyncCreateGame } from 'store/actions';

type CState = {
    value: string
}

class Challenger extends Component<any, CState> {
    constructor(props: any) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChangeValue = this.handleChangeValue.bind(this);
    }

    handleChangeValue(value: string) {
        this.setState({
            value: value
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text h4> Play Anagrams </Text>
                <View style={styles.create_game}>
                    <View style={styles.left_box}>
                        <Text style={styles.small_header}> Challenge a User </Text>
                        <TextInput
                            placeholder='Opponent Username'
                            value={this.state.value}
                            onChangeText={this.handleChangeValue}
                        />
                        <Button
                            disabled={this.state.value.length < 1}
                            title='Challenge User'
                            onPress={() => this.props.dispatch(asyncCreateGame(this.state.value))}
                        />
                    </View>
                    <View style={styles.right_box}>
                        <Text style={styles.small_header}> Create a Link </Text>
                        <Button title='Test' onPress={() =>
                            // TODO: Re-implement link
                            this.props.dispatch(asyncCreateGame())}/>
                    </View>
                </View>
            </View>
        )
    }
}

export default connect()(Challenger)

const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    create_game: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    left_box: {
        borderRightColor: 'gray',
        borderRightWidth: StyleSheet.hairlineWidth,

        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    right_box: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    small_header: {
        fontSize: 15,
        margin: 20,
    }
});


