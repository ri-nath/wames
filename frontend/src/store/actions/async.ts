import {AnagramObject, User} from '../../../types';
import {
    endActiveAnagramGame,
    recieveCreatedGame,
    recieveData,
    requestCreatedGame,
    requestData,
    startAnagramGame
} from 'store/actions/sync';
import Client from 'store/Client';

import Constants from 'expo-constants';
import {getConfig} from 'util/Anagram';

export function asyncRequestData() {
    return function(dispatch: any) {
        dispatch(requestData());

        Client.registerUser(Constants.installationId, (res_user: User, res_games: AnagramObject[]) => {
            dispatch(recieveData(res_user, res_games));
        });
    }
}

export function asyncCreateGame(...target_usernames: string[]) {
    return function(dispatch: any) {
        dispatch(requestCreatedGame());

        Client.createGame(target_usernames, (res: AnagramObject) => {
            dispatch(recieveCreatedGame(res));
        });
    }
}

export function startAnagramGameCycle(game: AnagramObject) {
    return function(dispatch: any) {
        dispatch(startAnagramGame(game));

        const ref = setTimeout(() =>
            dispatch(endActiveAnagramGame()),
            1000 * getConfig(game).duration);
    }
}