import socketIOClient from 'socket.io-client'

class DB {
    constructor() {
        const endpoint = 'http://localhost:3000/';

        this.socket = socketIOClient(endpoint);
        this.user_id = Math.random().toString(36).substring(7) // TODO: implement properly

        this.socket.emit('register-user', this.user_id);
    }

    createGame(rival_id) {
        this.socket.emit('create-game', rival_id);
    }

    onAddGame(handler) {
        // params: game
        this.socket.on('add-game', handler);
    }

    updateGameState(uuid, state) {
        this.socket.emit('update-game-state', uuid, state);
    }

    onNewGameState(handler) {
        //params: uuid, { [user_id]: new state }
        this.socket.on('new-game-state', handler);
    }
}