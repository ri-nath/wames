import React, { Component, Fragment } from 'react';
import { ActivityIndicator, Button, StyleSheet, TextInput, View, Text } from 'react-native';

import { connect } from 'react-redux';

import { dependOnVow, isResolved, lazyDependOnVow } from 'api';
import { asyncSetUsername } from 'store/actions';
import { State, User, Vow } from 'ts';

type CState = {
    value: string
}

type Props = {
    user: Vow<User>,
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
            value: isResolved(this.props.user) ? (this.props.user as unknown as User).username : ''
        });
    }

    render() {
        return (
            <View style={ styles.container }>
                {
                    lazyDependOnVow<User>(this.props.user,
                        () => <ActivityIndicator size='small'/>,
                        (err) => <Text> { err.toString() }</Text>,
                        (user: User) =>
                            <Fragment>
                                <TextInput
                                    placeholder='Username'
                                    value={ this.state.value }
                                    onChangeText={ this.handleChangeValue }
                                />
                                <Button
                                    disabled={ this.state.value.length < 1 || this.state.value === user.username }
                                    title='Confirm New Username'
                                    onPress={ this.handlePress }
                                />
                            </Fragment>
                        )
                }
            </View>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        user: state.data.user,
    };
}

export default connect(mapStateToProps)(NameChanger);

const styles = StyleSheet.create({
    container: {
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


