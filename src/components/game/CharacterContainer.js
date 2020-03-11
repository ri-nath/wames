import React from 'react';

import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { NON } from './Game';

export default function CharacterContainer(props) {
    return (
        <TouchableOpacity
            style={[styles.button, props.name.includes(NON) && styles.active]}
            onPress={props.onPress}
            activeOpacity={ 0 }
            disabled={ props.name.includes(NON) }
        >
            <Text
                style={styles.text}
            >
                { props.name.includes(NON) ? " " : props.name.charAt(0) }
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