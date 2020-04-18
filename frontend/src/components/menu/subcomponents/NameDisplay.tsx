import { lazyDependOnVow } from 'api';
import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { connect } from 'react-redux';
import { State, User, Vow } from 'ts';

type Props = {
    user: Vow<User>
}

class NameDisplay extends Component<Props, any> {
    render() {
        return (
            <View style={ styles.name }>
                {
                    lazyDependOnVow<User>(this.props.user,
                    () => <ActivityIndicator size='small'/>,
                    (err) => <Text> { err.toString()} </Text>,
                        (user: User) => <Text>Playing as: { user.username }</Text>
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

export default connect(mapStateToProps)(NameDisplay);

const styles = StyleSheet.create({
    name: {
        alignSelf: 'stretch',
        height: 25,
        backgroundColor: '#4fff86',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


