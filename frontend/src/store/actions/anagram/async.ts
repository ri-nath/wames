import { AnagramObject } from '../../../../types';
import { endActiveGame, startGame } from 'store/actions/anagram/sync';
import { getConfig } from 'util/Anagram';

export function initNewGame(game: AnagramObject) {
    return function(dispatch: any) {
        dispatch(startGame(game));

        setTimeout(endActiveGame, 1000.0 * getConfig(game).duration);
    }
}