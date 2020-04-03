import {AnagramObject, User} from '../../../types';
import {
    endAnagramGame,
    receiveCreatedGame,
    receiveData, receiveUser,
    requestCreatedGame,
    requestData, requestUser,
    startAnagramGame
} from 'store/actions/sync';
import Client from 'store/Client';

import Constants from 'expo-constants';
import { getConfig } from 'util/Anagram';
import { isError } from 'util/Error';
import { Dispatch } from 'redux';

export function asyncRequestData() {
    return function(dispatch: any) {
        dispatch(requestData());

        Client.registerUser(Constants.installationId, (res_user: User, res_games: AnagramObject[]) => {
            dispatch(receiveData(res_user, res_games));
        });
    }
}

export function asyncCreateGame(...target_usernames: string[]) {
    return function(dispatch: any) {
        dispatch(requestCreatedGame());


        Client.createGame(target_usernames, (res: AnagramObject) => {
            dispatch(receiveCreatedGame(res));
        });
    }
}

export function startAnagramGameCycle(game: AnagramObject) {
    return function(dispatch: any) {
        dispatch(startAnagramGame(game));

        const ref = setTimeout(() =>
            dispatch(endAnagramGame(game)),
            1000 * getConfig(game).duration);
    }
}

export function asyncSetUsername(username: string) {
    return function(dispatch: any) {
        dispatch(requestUser());

        Client.setUsername(username, (res: User | Error) => {
            if (!isError(res)) {
                // @ts-ignore
                dispatch(receiveUser(res));
            }
        });
    }
}