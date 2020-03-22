import io from 'socket.io-client';

import Centralizer from './Centralizer';
import * as Constants from '../constants';
import { AnagramState } from './wrappers/Anagram';

class DB {
    private socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io(Constants.SERVER_ENDPOINT);

        this.socket.on('connect', () => {
            console.log('Socket Connected!');
            this.socket.emit('register-user', Centralizer.getUsername());
        });

        this.socket.on('reconnect', () => {
            console.log('Socket Reconnected!');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected!');
        });
    }

    createGame(...target_users: string[]) {
        this.socket.emit('create-game', Centralizer.getUsername(), ...target_users);
    }

    onGameCreation(handler: Function) {
        // args: game object
        this.socket.on('return-game', handler);
    }

    onNewGames(handler: Function) {
        // args: array of game objects
        this.socket.on('new-games', handler);
    }

    updateGameState(game_uuid: number, state: AnagramState) {
        this.socket.emit('update-game-state', game_uuid, state);
    }

    onNewGameState(handler: Function) {
        // args: game uuid, username, new state
        this.socket.on('new-game-state', handler);
    }

    setUsername(username: String) {
        this.socket.emit('set-user-id', username);
    }

    onSetUsername(handler: Function) {
        this.socket.on('new-user-id', handler);
    }
}

export default new DB();