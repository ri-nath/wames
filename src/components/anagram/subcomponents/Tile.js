import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import * as Constants from '../../../constants';

export default function Tile(props) {
    return (
        <TouchableOpacity
            style={ [styles.button, props.name.includes(Constants.DESELECTOR) && styles.active] }
            onPress={ props.onPress }
            activeOpacity={ 0 }
            disabled={ props.name.includes(Constants.DESELECTOR) }
        >
            <Text style={ styles.text }>
                { props.name.includes(Constants.DESELECTOR) ? " " : props.name.charAt(0) }
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        color: '#E4EDE4',
        textAlign: 'center'
    },

    button: {
        width: 45,
        height: 45,
        padding: 10,
        margin: 2,
        backgroundColor: '#9DBF9E',
        borderRadius: 5,
    },

    active: {
        backgroundColor: '#566957',
    },
});