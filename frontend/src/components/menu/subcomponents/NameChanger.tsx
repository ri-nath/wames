import React, { Component } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import { connect } from 'react-redux';

import { asyncSetUsername } from 'store/actions';

type CState = {
    value: string
}

type Props = {
    username: string,
    dispatch: any;
}


class NameChanger extends Component<Props, CState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.handlePress = this.handlePress.bind(this);
    }

    handleChangeValue(value: string) {
        this.setState({
            value: value
        });
    }

    handlePress() {
        this.props.dispatch(asyncSetUsername(this.state.value));
    }

    componentDidMount() {
        this.setState({
            value: this.props.username
        });
    }

    render() {
        return (
            <View style={ styles.create_game }>
                <TextInput
                    placeholder='Username'
                    value={ this.state.value }
                    onChangeText={ this.handleChangeValue }
                />
                <Button
                    disabled={ this.state.value.length < 1 || this.state.value === this.props.username }
                    title='Confirm New Username'
                    onPress={ this.handlePress }
                />
            </View>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        // @ts-ignore
        username: isResolved(state.data.user) ? state.data.user.username : ''
    };
}

export default connect(mapStateToProps)(NameChanger);

const styles = StyleSheet.create({
    create_game: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        backgroundColor: '#DEC0F1',
        padding: 5,
        borderRadius: 10
    }
});


