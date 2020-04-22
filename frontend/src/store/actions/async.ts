import { getConfig, getID, isAnyError, lazyEndGame, lazyGetState, m_user } from 'api';

import Constants from 'expo-constants';
import { Alert } from 'react-native';
import {
    endAnagramGame,
    receiveCreatedGame,
    receiveUser,
    requestCreatedGame,
    requestUser, setMenuScreen,
    startAnagramGame,
    updateGameState
} from 'store/actions/sync';
import Client from 'store/Client';
import { AnagramObject, State, User, WamesError } from 'ts';

export function asyncCreateGame(...target_usernames: string[]) {
    return function (dispatch: any) {
        dispatch(requestCreatedGame());


        Client.createGame(target_usernames, (res) => {
            if (isAnyError(res)) {
                Alert.alert(
                    'Error',
                    (res as WamesError).message,
                    [
                        {
                            text: 'OK',
                            onPress: () => dispatch(setMenuScreen('Menu')),
                        }
                    ],
                    {
                        onDismiss: () => dispatch(setMenuScreen('Menu')),

                    }
                );
            } else {
                dispatch(receiveCreatedGame(res as AnagramObject));
            }
        });
    };
}

export function startAnagramGameCycle(game: AnagramObject) {
    return function (dispatch: any, getState: () => State) {
        dispatch(startAnagramGame(game));

        const ref = setTimeout(() => {
            let game = getState().anagram.active_game;
            if (game) {
                game = lazyEndGame(game);
                dispatch(endAnagramGame(game));

                Client.updateGameState(getID(game), lazyGetState(game), (res) => {
                    if (isAnyError(res)) {
                        Alert.alert(
                            'Error',
                            (res as WamesError).message,
                            [
                                {
                                    text: 'OK',
                                }
                            ],
                        );
                    }
                });
            }
        }, 1000 * getConfig(game).duration);
    };
}

export function asyncSetUsername(username: string) {
    return function (dispatch: any, getState: () => State) {
        const curr_user = getState().data.user;

        dispatch(requestUser());

        Client.setUsername(username, (res) => {
            if (isAnyError(res)) {
                Alert.alert(
                    'Error',
                    (res as WamesError).message,
                    [
                        {
                            text: 'OK',
                            onPress: () => dispatch(receiveUser(curr_user as User)),
                        }
                    ],
                    {
                        onDismiss: () => dispatch(receiveUser(curr_user as User)),

                    }
                );
            } else {
                dispatch(receiveUser(res as unknown as User));
            }
        });
    };
}

export function markGameAsViewed(game: AnagramObject) {
    return function (dispatch: any) {
        dispatch(updateGameState(getID(game), m_user, {
            viewed: true
        }));

        Client.markGameAsViewed(getID(game), (res) => {
            if (isAnyError(res)) {
                Alert.alert(
                    'Error',
                    (res as WamesError).message,
                    [
                        {
                            text: 'OK',
                        }
                    ],
                );
            }
        });
    };
}