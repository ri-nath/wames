import {AnagramObject, AnagramState, User} from '../../../../types';
import { Action } from 'store/actions/types';

export function requestData(): Action {
    return {
        type: 'REQUEST_DATA',
    }
}

export function recieveData(user: User, games: AnagramObject[]): Action {
    return {
        type: 'RECIEVE_DATA',
        user: user,
        games: games,
    }
}

export function requestUser() {
    return {
        type: 'REQUEST_USER'
    }
}

export function recieveUser(user: User | Error) {
    return {
        type: 'RECIEVE_USER',
        user: user,
    }
}

export function addNewGames(...games: AnagramObject[]): Action {
    return {
        type: 'PROCESS_GAMES',
        payload: games,
    }
}

export function updateGameState(game_id: string,  updating_user: User, state: Partial<AnagramState>): Action {
    return {
        type: 'UPDATE_GAME_STATE',
        game_id: game_id,
        state: state,
        user: updating_user,
    }
}