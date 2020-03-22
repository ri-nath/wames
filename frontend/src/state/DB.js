import io from 'socket.io-client'

import Centralizer from './Centralizer';
import * as Constants from '../constants';

class DB {
    constructor() {
        this.socket = io(Constants.SERVER_ENDPOINT);

        this.socket.on('connect', _ => {
            console.log('Socket Connected!');
            this.socket.emit('register-user', Centralizer.getUsername());
        });

        this.socket.on('reconnect', _ => {
            console.log('Socket Reconnected!');
        });

        this.socket.on('disconnect', _ => {
            console.log('Socket Disconnected!');
        })
    }

    createGame(...target_users) {
        this.socket.emit('create-game', Centralizer.getUsername(), ...target_users);
    }

    onGameCreation(handler) {
        // args: game object
        this.socket.on('return-game', handler);
    }

    onNewGames(handler) {
        // args: array of game objects
        this.socket.on('new-games', handler);
    }

    updateGameState(game_uuid, state) {
        this.socket.emit('update-game-state', game_uuid, state);
    }

    onNewGameState(handler) {
        // args: game uuid, username, new state
        this.socket.on('new-game-state', handler);
    }

    setUsername(username) {
        this.socket.emit('set-user-id', user_id);
    }

    onSetUsername(handler) {
        this.socket.on('new-user-id', handler);
    }
}

export default new DB();