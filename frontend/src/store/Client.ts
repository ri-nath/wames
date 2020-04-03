import io from 'socket.io-client';

import * as PConstants from 'constants';
import { AnagramObject, AnagramState, User } from '../../types';

enum Events {
    ERROR = 'error',
    REGISTER_USER = 'register-user',
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
        this.socket = io(PConstants.SERVER_ENDPOINT);

        this.socket.on('connect', () => {
            console.log('Socket Connected!');
        });

        this.socket.on('reconnect', () => {
            console.log('Socket Reconnected!');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected!');
        });
    }

    registerUser(user_id: string, callback: (user: User, games: AnagramObject[]) => void) {
        this.socket.emit(Events.REGISTER_USER, user_id, callback);
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

    updateGameState(game_uuid: string, state: AnagramState) {
        this.socket.emit(Events.UPDATE_GAME_STATE, game_uuid, state);
    }

    markGameAsViewed(game_id: string) {
        this.socket.emit(Events.MARK_AS_VIEWED, game_id);
    }

    onNewGameState(handler: (game_id: string, updating_user: User, updated_state: AnagramState) => void) {
        this.socket.on(Events.UPDATE_GAME_STATE, handler);
    }

    joinGameByID(id: string, handler: (res: AnagramObject | null) => void) {
        this.socket.emit(Events.JOIN_GAME, id, handler);
    }
}

export default new Client();