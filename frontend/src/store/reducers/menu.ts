import { Action, initialState, MenuState } from 'ts';

export default function menu(state = initialState.menu, action: Action): MenuState {
    switch (action.type) {
        case 'START_GAME':
            return { ...state, screen: 'Menu' };
        case 'REQUEST_CREATED_GAME':
            return { ...state, screen: 'Game Portal', portal_game: 'FETCHING' };
        case 'END_GAME':
        case 'RECEIVE_CREATED_GAME':
        case 'OPEN_GAME_PORTAL':
            return { ...state, screen: 'Game Portal', portal_game: action.game };
        case 'SET_SCREEN':
            return { ...state, screen: action.screen };
        default:
            return state;
    }
}