import { AnagramObject, AnagramState, User } from '../../../types';
import {Action, AppState, MenuState} from 'store/types';

export function startAnagramGame(game: AnagramObject): Action {
    return {
        type: 'START_GAME',
        game: game,
    }
}

export function endAnagramGame(game: AnagramObject): Action {
    return {
        type: 'END_GAME',
        game: game,
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

export function receiveCreatedGame(game: AnagramObject): Action {
    return {
        type: 'RECEIVE_CREATED_GAME',
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

export function setAppState(state: AppState['state']): Action {
    return {
        type: 'SET_APP_STATE',
        state: state,
    }
}

export function requestData() {
    return {
        type: 'REQUEST_DATA'
    }
}

export function receiveData(user: User, games: AnagramObject[]) {
    return {
        type: 'RECEIVE_DATA',
        user: user,
        games: games
    }
}

export function requestUser() {
    return {
        type: 'REQUEST_USER',
    }
}

export function receiveUser(user: User) {
    return {
        type: 'RECEIVE_USER',
        user: user,
    }
}

export function processGames(games: AnagramObject[]) {
    return {
        type: 'PROCESS_GAMES',
        games: games,
    }
}

export function updateGameState(game_id: string, user: User, state: Partial<AnagramState>) {
    return {
        type: 'UPDATE_GAME_STATE',
        state: state,
        user: user,
    }
}