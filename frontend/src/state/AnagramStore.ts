import WamesEmitter, {WamesListener} from 'lib/WamesEmitter';

import {AnagramObject, AnagramState, User} from '../../types';

import SuperStore, { SuperState } from './SuperStore';
import RootNavigator from './RootNavigator';
import DB from 'server/ServerStore';
import Anagram from 'lib/Anagram';

enum EVENTS {
    START_GAME = 'start-game',
    END_GAME = 'end-game',
    SCORE_WORD = 'score-word',
    UPDATE_GAMES_LIST= 'update-games-list'
}

class AnagramStore {
    private emitter: WamesEmitter;
    private games: Anagram[];

    private timeout_handle: number | null;
    private active_game: Anagram | null;

    constructor() {
        this.emitter = new WamesEmitter();

        this.active_game = null;
        this.timeout_handle = null;

        this.setListeners();

        this.games = [];
    }

    setListeners() {
        SuperStore.onStateToAnagramGame((game: Anagram) => {
            this.processLoadGame(game, true);
        });

        DB.onNewGames((new_games: AnagramObject[]) => {
            new_games.forEach(game => this.processLoadGame(new Anagram(game, DB.getUserID()), false));
        });

        DB.onNewGameState((game_uuid: string, user: User, state: AnagramState) => {
            let index = this.games.findIndex(game => game.getID() === game_uuid);

            if (index > -1) {
                this.games[index].setState(user.user_id, state);

                this.games[index].setLocalState({
                        viewed: false,
                });

                this.emitter.emit(EVENTS.UPDATE_GAMES_LIST, this.games);
            }
            // TODO: Maybe add game if not found?
        });
    }

    processLoadGame(game_object: Anagram, set_active: boolean) {
        let index = this.games.findIndex(game => game.getID() === game_object.getID());

        if (index > -1) {
            this.games[index] = game_object;
        } else {
            this.games.push(game_object);
        }

        this.games.sort((a: Anagram, b: Anagram) => a.getID().localeCompare((b.getID())));

        if (set_active) {
            this.startNewGame(game_object);
        }

        console.log(this.games, new Date());

        this.emitter.emit(EVENTS.UPDATE_GAMES_LIST, this.games);
    }

    markGameAsViewed(game_object: Anagram) {
        let index = this.games.findIndex(game => game.getID() === game_object.getID());

        if (index > -1) {
            this.games[index].markAsViewed();

            DB.markGameAsViewed(this.games[index].getID());
        }

        this.emitter.emit(EVENTS.UPDATE_GAMES_LIST, this.games);
    }

    startNewGame(game_object: Anagram) {
        this.active_game = game_object;

        if (this.timeout_handle) clearTimeout(this.timeout_handle);
        this.timeout_handle = setTimeout(() => {
            this.endActiveGame()
        }, this.active_game.getConfig().duration * 1000);

        this.active_game.setLocalState({
            stage: 'RUNNING'
        });

        this.emitter.emit(EVENTS.START_GAME, this.active_game);
    }

    endActiveGame() {
        if (this.timeout_handle) clearTimeout(this.timeout_handle);

        if (this.active_game) {
            this.active_game.setLocalState({
                stage: 'FINISHED'
            });

            DB.updateGameState(
                this.active_game.getID(),
                this.active_game.getLocalState()
            );

            SuperStore.setState(SuperState.MENU);
            RootNavigator.navigateToAnagramInfo(this.active_game);

            this.emitter.emit(EVENTS.END_GAME, this.active_game);
        } else {
            console.error('Game not initialized! ', 'endGame()');
        }
    }

    scoreWord(word: string) {
        if (this.active_game) {
            this.active_game.lazyScoreWord(word);

            this.emitter.emit(EVENTS.SCORE_WORD, this.active_game);
        } else {
            console.error('Game not initialized! ', 'scoreWord() ', word);
        }
    }

    // TODO: Replace with one method

    onUpdateGamesList(handler: Function): WamesListener {
        return this.emitter.wrappedListen(EVENTS.UPDATE_GAMES_LIST, handler);
    }

    onStartNewGame(handler: Function): WamesListener {
        return this.emitter.wrappedListen(EVENTS.START_GAME, handler);
    }

    onEndGame(handler: (game: Anagram) => void): WamesListener {
        return this.emitter.wrappedListen(EVENTS.END_GAME, handler);
    }

    onScoreWord(handler: Function): WamesListener {
        return this.emitter.wrappedListen(EVENTS.SCORE_WORD, handler);
    }

    closeAllListeners() {
        for (const event of Object.values(EVENTS)) {
            // @ts-ignore
            this.emitter.off(event);
        }
    }

    getActiveGame(): Anagram {
        if (this.active_game) {
            return this.active_game;
        } else {
            throw 'getActiveGame(): Game not initialized properly!'
        }
    }

    getGamesList(): Anagram[] {
        return this.games;
    }
}

export default new AnagramStore();