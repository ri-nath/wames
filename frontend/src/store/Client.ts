import io from 'socket.io-client';

import { AnagramObject, AnagramState, User } from 'ts';
import { receiveData, requestData } from './actions';
import * as PConstants from 'constants.js';
import store from './Store';

import Constants from 'expo-constants';

enum Events {
    ERROR = 'error',
    REQUEST_IDENTIFIER = 'req-id',
    REGISTER_USER = 'register-user',
    DATA='data',
    NEW_GAMES = 'new-games',
    CREATE_GAME = 'create-game',
    SET_USERNAME = 'user-id',
    UPDATE_GAME_STATE = 'update-game-state',
    MARK_AS_VIEWED = 'view',
    JOIN_GAME = 'join',
}

class Client {
    public socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect(PConstants.SERVER_ENDPOINT, {
            query: 'deviceid=' + Constants.installationId ? Constants.installationId : Math.random().toString(36).substring(2, 15)
        });

        this.socket.on('connect', () => {
            console.log('Socket Connected!');
        });

        this.socket.on('reconnect', () => {
            console.log('Socket Reconnected!');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected!');
        });

        this.socket.on(Events.DATA, (user: User, games: AnagramObject[]) => {
            store.dispatch(receiveData(user, games));
        });
    }

    setUsername(username: String, callback: (res: User | Error) => void) {
        this.socket.emit(Events.SET_USERNAME, username, callback);
    }

    createGame(target_users: string[], callback: (game: AnagramObject) => void) {
        this.socket.emit(Events.CREATE_GAME, target_users, callback);
    }

    onNewGames(handler: (games: AnagramObject[]) => void) {
        this.socket.on(Events.NEW_GAMES, handler);
    }

    updateGameState(game_uuid: string, state: AnagramState, callback: (res: boolean | Error) => void) {
        this.socket.emit(Events.UPDATE_GAME_STATE, game_uuid, state, callback);
    }

    markGameAsViewed(game_id: string, callback: (res: boolean | Error) => void) {
        this.socket.emit(Events.MARK_AS_VIEWED, game_id, callback);
    }

    onNewGameState(handler: (game_id: string, updating_user: User, updated_state: AnagramState) => void) {
        this.socket.on(Events.UPDATE_GAME_STATE, handler);
    }

    joinGameByID(id: string, handler: (res: AnagramObject | Error) => void) {
        this.socket.emit(Events.JOIN_GAME, id, handler);
    }
}

export default new Client();