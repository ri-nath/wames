import { AnagramObject, AnagramState, User } from '../../../types';
import {Action, MenuState, Vow} from 'store/types';

export function startAnagramGame(game: AnagramObject): Action {
    return {
        type: 'START_GAME',
        game: game,
    }
}

export function endActiveAnagramGame(): Action {
    return {
        type: 'END_GAME',
    }
}

export function scoreWordOnActiveAnagramGame(word: string): Action {
    return {
        type: 'SCORE_WORD',
        word: word,
    }
}

export function requestCreatedGame(): Action {
    return {
        type: 'REQUEST_CREATED_GAME',
    }
}

export function recieveCreatedGame(game: AnagramObject): Action {
    return {
        type: 'RECIEVE_CREATED_GAME',
        game: game,
    }
}

export function openGamePortal(game: AnagramObject): Action {
    return {
        type: 'OPEN_GAME_PORTAL',
        game: game,
    }
}

export function setMenuScreen(screen: MenuState['screen']): Action {
    return {
        type: 'SET_SCREEN',
        screen: screen,
    }
}

export function requestData() {
    return {
        type: 'REQUEST_DATA'
    }
}

export function recieveData(user: User, games: AnagramObject[]) {
    return {
        type: 'RECIEVE_DATA',
        user: user,
        games: games
    }
}

export function requestUser() {
    return {
        type: 'REQUEST_USER',
    }
}

export function recieveUser(user: User) {
    return {
        type: 'RECIEVE_USER',
        user: user,
    }
}

export function processGames(games: AnagramObject[]) {
    return {
        type: 'PROCESS_GAMES',
        games: games,
    }
}

export function updateGameState(game_id: string, state: AnagramState, user: User) {
    return {
        type: 'UPDATE_GAME_STATE',
        state: state,
        user: user,
    }
}