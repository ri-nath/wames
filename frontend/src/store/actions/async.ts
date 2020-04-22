import { getConfig, getID, isError, lazyEndGame, lazyGetState, m_user } from 'api';

import Constants from 'expo-constants';
import { Alert } from 'react-native';
import {
    endAnagramGame,
    receiveCreatedGame,
    receiveUser,
    requestCreatedGame,
    requestUser,
    startAnagramGame,
    updateGameState
} from 'store/actions/sync';
import Client from 'store/Client';
import { AnagramObject, State, User } from 'ts';

export function asyncCreateGame(...target_usernames: string[]) {
    return function (dispatch: any) {
        dispatch(requestCreatedGame());


        Client.createGame(target_usernames, (res: AnagramObject) => {
            dispatch(receiveCreatedGame(res));
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
                Client.updateGameState(getID(game), lazyGetState(game), (res) => isError(res) ? Alert.alert('Error', res.toString()) : null);
            }
        }, 1000 * getConfig(game).duration);
    };
}

export function asyncSetUsername(username: string) {
    return function (dispatch: any) {
        dispatch(requestUser());

        Client.setUsername(username, (res: User | Error) => {
            if (!isError(res)) {
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

        Client.markGameAsViewed(getID(game), (res) => isError(res) ? Alert.alert('Error', res.toString()) : null);
    };
}