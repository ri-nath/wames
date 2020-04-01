import io from 'socket.io-client';
import Constants from 'expo-constants';

import * as PConstants from 'constants';
import WamesEmitter, {WamesListener} from 'lib/WamesEmitter';
import { AnagramObject, AnagramState, User } from '../../types';
import Anagram from 'lib/Anagram';

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

class ServerStore {
    private socket: SocketIOClient.Socket;
    private user: User | undefined;
    private connected: boolean;
    private emitter: WamesEmitter;

    constructor() {
        this.connected = false;

        this.emitter = new WamesEmitter();
        this.socket = io(PConstants.SERVER_ENDPOINT);

        this.socket.on('connect', () => {
            console.log('Socket Connected!');

            this.socket.emit(Events.REGISTER_USER, Constants.installationId, (res: User | Error) => {
                if (!(res instanceof Error)) {
                    this.user = res;

                    this.connected = true;
                    this.emitter.emit('connect', res);
                }
            });
        });

        this.socket.on('reconnect', () => {
            console.log('Socket Reconnected!');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected!');
        });
    }

    isConnected(): boolean {
        return this.connected;
    }

    onConnect(handler: (res: User) => void) {
        this.emitter.on('connect', handler);
    }

    createGame(target_users: string[], callback: (game: AnagramObject) => void) {
        this.socket.emit(Events.CREATE_GAME, target_users, callback);
    }

    onNewGames(handler: Function) {
        // args: array of game objects
        this.socket.on(Events.NEW_GAMES, handler);
    }

    updateGameState(game_uuid: string, state: AnagramState) {
        this.socket.emit(Events.UPDATE_GAME_STATE, game_uuid, state);
    }

    markGameAsViewed(game_id: string) {
        this.socket.emit(Events.MARK_AS_VIEWED, game_id);
    }

    onNewGameState(handler: Function) {
        // args: game uuid, username, new state, unview
        this.socket.on(Events.UPDATE_GAME_STATE, handler);
    }

    setUsername(username: String) {
        this.socket.emit(Events.SET_USERNAME, username, (res: User | Error) => {
            if (!(res instanceof Error)) {
                this.emitter.emit(Events.SET_USERNAME, res.username);
            }
        });
    }

    onSetUsername(handler: (res: string) => void): WamesListener {
        return this.emitter.wrappedListen(Events.SET_USERNAME, handler);
    }

    getUsername() {
        return this.user ? this.user.username : '';
    }

    getUserID() {
        return this.user ? this.user.user_id : '';
    }

    joinGameByID(id: string, handler: (res: AnagramObject | null) => void) {
        this.socket.emit(Events.JOIN_GAME, id, handler);
    }
}

export default new ServerStore();