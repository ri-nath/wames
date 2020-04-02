import Constants from 'expo-constants';

import Client from 'store/Client';
import {AnagramObject, User} from '../../../../types';
import {recieveData, recieveUser, requestData, requestUser} from './sync';

export function fetchData(user_id = Constants.installationId) {
    return function(dispatch: any) {
        dispatch(requestData());

        Client.registerUser(user_id, (user: User, games: AnagramObject[]) => {
            dispatch(recieveData(user, games));
        });
    }
}

export function changeUsername(username: string) {
    return function (dispatch: any) {
        dispatch(requestUser());

        Client.setUsername(username, (user: User | Error) => {
            dispatch(recieveUser(user));
        })
    }
}