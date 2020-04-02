import { Action } from 'store/actions/types';
import { initialState } from 'store/reducers/types';

export default function menu(state = initialState.menu, action: Action) {
    switch(action.type) {
        case 'SET_STATE_TO_GAME_PORTAL':
            return { ...state, state: 'ANAGRAM_PORTAL', portal_game: action.game }
        case 'SET_STATE':
            return { ...state, state: action.state };
        default:
            return state;
    }
}