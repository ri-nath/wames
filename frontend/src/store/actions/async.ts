import { getConfig, getID, isError, lazyEndGame, lazyGetState, m_user } from 'api';

import Constants from 'expo-constants';
import {
    endAnagramGame,
    receiveCreatedGame,
    receiveData,
    receiveUser,
    requestCreatedGame,
    requestData,
    requestUser,
    startAnagramGame,
    updateGameState
} from 'store/actions/sync';
import Client from 'store/Client';
import { AnagramObject, State, User } from 'ts';


export function asyncRequestData() {
    return function (dispatch: any) {
        dispatch(requestData());

        Client.registerUser(Constants.installationId ? Constants.installationId : 'random' + Math.random().toString(36).substring(2, 15), (res_user: User, res_games: AnagramObject[]) => {
            dispatch(receiveData(res_user, res_games));
        });
    };
}

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
                Client.updateGameState(getID(game), lazyGetState(game));
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

        Client.markGameAsViewed(getID(game));
    };
}