import {AnagramObject, AnagramState, User} from '../../../../types';
import { Action } from 'store/actions/types';

export function startGame(game: AnagramObject): Action {
    return {
        type: 'START_GAME',
        game: game,
    }
}

export function endActiveGame(): Action {
    return {
        type: 'END_GAME',
    }
}

export function scoreWord(word: string) {
    return {
        type: 'SCORE_WORD',
        word: word,
    }
}