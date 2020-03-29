import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import * as PConstants from 'constants';

type Props = {
    name: string
    onPress: any
}

export default function Tile(props: Props) {
    const disabled = props.name.includes(PConstants.DESELECTOR);

    return (
        <TouchableOpacity
            style={ [styles.button, disabled && styles.active] }
            onPress={ props.onPress }
            activeOpacity={ 0 }
            disabled={ disabled }
        >
            <Text style={ styles.text }>
                { disabled ? " " : props.name.charAt(0) }
            </Text>
        </TouchableOpacity>
    )
}

const length = Dimensions.get('window').width * (1.0 / 8.0);
const margin = 2;
const filtered_length = length - 2.0 * margin;

const styles = StyleSheet.create({
    text: {
        color: '#E4EDE4',
        textAlign: 'center'
    },

    button: {
        width: filtered_length,
        height: filtered_length,
        padding: 10,
        margin: margin,
        backgroundColor: '#9DBF9E',
        borderRadius: 5,
    },

    active: {
        backgroundColor: '#566957',
    },
});