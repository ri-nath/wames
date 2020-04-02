import { MenuState } from 'store/reducers/types';
import { Action } from 'store/actions/types';
import {AnagramObject} from '../../../../types';

export function setMenuState(state: MenuState['state']): Action {
    return {
        type: 'SET_STATE',
        state: state
    }
}

export function toGamePortal(game: AnagramObject): Action {
    return {
        type: 'SET_STATE_TO_GAME_PORTAL',
        game: game,
    }
}