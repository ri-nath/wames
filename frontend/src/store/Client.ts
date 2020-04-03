import io from 'socket.io-client';

import * as PConstants from 'constants';
import { AnagramObject, User } from '../../types';

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
}

export default new Client();