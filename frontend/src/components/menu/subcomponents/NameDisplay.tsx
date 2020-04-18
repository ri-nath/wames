import { isResolved } from 'api';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { connect } from 'react-redux';
import { State } from 'ts';

type Props = {
    name: string
}

class NameDisplay extends Component<Props, any> {
    render() {
        return (
            <View style={ styles.name }>
                <Text> Playing as: { this.props.name } </Text>
            </View>
        );
    }
}

function mapStateToProps(state: State) {
    return {
        // @ts-ignore
        name: isResolved(state.data.user) ? state.data.user.username : 'undefined'
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


