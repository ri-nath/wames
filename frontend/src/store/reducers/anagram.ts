import { Action, initialState } from 'store/types';
import {lazyEndGame, lazyScoreWord, lazySetState} from 'util/Anagram';

export default function anagram(state = initialState.anagram, action: Action) {
    switch(action.type) {
        case 'START_GAME':
            return { ...state, active_game: action.game };
        case 'END_GAME':
            if (state.active_game) {
                return { ...state, active_game: action.game }
            }
            return state;
        case 'SCORE_WORD':
            if (state.active_game) {
                return { ...state, active_game: lazyScoreWord(state.active_game, action.word)}
            }
            return state;
        default:
            return state;
    }
}