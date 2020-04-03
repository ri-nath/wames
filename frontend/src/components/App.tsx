import React, { Component, Fragment } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';

import MenuContainer from './menu/MenuContainer';
import AnagramContainer from './anagram/AnagramContainer';

import { AppState, State } from 'store/types';
import { asyncRequestData } from 'store/actions';

type Props = {
    state: AppState["state"],
    dispatch: any,
}

class App extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount(): void {
        this.props.dispatch(asyncRequestData());
    }

    render() {
        return (
            <Fragment>
                    { this.props.state === 'LOADING' && <View style={styles.container}><Text>Connecting to Server...</Text></View>}
                    { this.props.state === 'MENU' && <MenuContainer style={styles.container}/> }
                    { this.props.state === 'ANAGRAM_GAME' && <AnagramContainer style={styles.container}/> }
            </Fragment>

        )
    }
}

function mapStateToProps(state: State) {
    return {
        state: state.app.state,
    }
}

export default connect(mapStateToProps)(App)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
