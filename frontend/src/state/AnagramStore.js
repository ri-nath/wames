import MicroEmitter from 'micro-emitter';
import SuperStore, { State } from './SuperStore';
import DB from './DB';

import Anagram, { AnagramState } from './wrappers/Anagram';

const EVENTS = {
    START_GAME: 'start-game',
    END_GAME: 'end-game',
    SCORE_WORD: 'score-word',
    UPDATE_GAMES_LIST: 'update-games-list',
};

class AnagramStore {
    constructor() {
        this.emitter = new MicroEmitter();

        this.active_game = null;
        this.active_timeout = null;

        this.setListeners();

        // const debugger = {
        //     get: function(target, property) {
        //         console.log('getting ', property, 'which is ', target[property]);
        //         // property is index in this case
        //         return target[property];
        //     },
        //     set: function(target, property, value, receiver) {
        //         console.log('setting ', property, ' with value' , value);
        //         target[property] = value;
        //         // you have to return true to accept the changes
        //         return true;
        //     }
        // };
        //
        // this.games = new Proxy([], debugger);

        this.games = [];

        // setInterval(_ => {
        //     console.log(this.games.length > 0 ? this.games[0].getObject().states : "print");
        // }, 1000);
    }

    setListeners() {
        SuperStore.onSetState(State.ANAGRAM_GAME, game_object => {
            this.processUpdateGame(game_object, true);
        });

        DB.onNewGames(new_games => {
            new_games.forEach(game => this.processUpdateGame(new Anagram(game), false));
        });

        DB.onNewGameState((game_uuid, username, state) => {
            let index = this.games.findIndex(game => game.getID() === game_uuid);

            if (index > -1) {
                this.games[index].setState(username, state);

                this.emitter.emit(EVENTS.UPDATE_GAMES_LIST, this.games);
            }

            // TODO: Maybe add game if not found?
        });
    }

    processUpdateGame(game_object, set_active) {
        let index = this.games.findIndex(game => game.getID() === game_object.getID());

        if (index > -1) {
            this.games[index] = game_object;
        } else {
            this.games.push(game_object);
        }

        if (set_active) {
            this.startNewGame(game_object);
        }

        this.emitter.emit(EVENTS.UPDATE_GAMES_LIST, this.games);
    }

    startNewGame(game_object) {
        this.active_game = game_object;

        if (!this.active_game) clearTimeout(this.active_timeout);
        this.active_timeout = setTimeout(() => {
            this.endActiveGame()
        }, this.active_game.getConfig().duration * 1000);

        this.active_game.setLocalState({
            stage: AnagramState.PLAYING
        });

        this.emitter.emit(EVENTS.START_GAME, this.active_game);
    }

    endActiveGame() {
        if (!this.active_timeout) clearTimeout(this.active_timeout);

        this.active_game.setLocalState({
            stage: AnagramState.FINISHED
        });

        DB.updateGameState(
            this.active_game.getID(),
            this.active_game.getLocalState()
        );

        this.emitter.emit(EVENTS.END_GAME, this.active_game);
    }

    scoreWord(word) {
        this.active_game.lazyScoreWord(word);

        this.emitter.emit(EVENTS.SCORE_WORD, this.active_game);
    }

    // TODO: Replace with one method

    onUpdateGamesList(handler) {
        this.emitter.on(EVENTS.UPDATE_GAMES_LIST, handler);
    }

    onStartNewGame(handler) {
        this.emitter.on(EVENTS.START_GAME, handler);
    }

    onEndGame(handler) {
        this.emitter.on(EVENTS.END_GAME, handler);
    }

    onScoreWord(handler) {
        this.emitter.on(EVENTS.SCORE_WORD, handler);
    }

    closeAllListeners() {
        for (const event of Object.values(EVENTS)) {
            this.emitter.off(event);
        }
    }

    getActiveGame() {
        return this.active_game;
    }

    getGamesList() {
        return this.games;
    }
}

export default new AnagramStore();