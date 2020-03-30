import { AnagramObject, AnagramState, User } from '../types';

import DB from './Database';

import * as express from 'express';
import * as io from 'socket.io';
import * as http from 'http';

import { Socket } from 'socket.io';
import * as AUtil from './util/Anagram.js';

enum Events {
    ERROR = 'error',
    REGISTER_USER = 'register-user',
    NEW_GAMES = 'new-games',
    CREATE_GAME = 'create-game',
    SET_USERNAME = 'user-id',
    UPDATE_GAME_STATE = 'update-game-state'
}

interface LooseSocket extends Socket {
    registered: boolean,
    user: User
}

export default class Server {
    private app;
    private server;
    private io;

    private sockets_list: LooseSocket[] = [];

    constructor() {
        this.setListeners = this.setListeners.bind(this);

        this.app = express();
        this.server = http.createServer(this.app);
        this.io = io(this.server);

        this.app.get('/', (req, res) => {
            res.sendFile(__dirname + './index.html');
        });

        const port = process.env.PORT || 3000;

        this.server.listen(port, () => console.log("Listening on port ", port));

        this.io.on('connection', this.setListeners);
    }

    setListeners(socket: LooseSocket) {
        console.log('A socket connected from ', socket.handshake.address);

        socket.on(Events.REGISTER_USER, (user_id: string, callback: (ret: User | Error) => void) => {
            console.log('Registering user: ', user_id);

            DB.registerUser(user_id, res => {
                console.log('Resolved user: ', res);

                    if (!(res instanceof Error)) {
                        socket.user = res;
                        socket.registered = true;

                        this.sockets_list.push(socket);

                        DB.getUserAnagramGames(res, (games: AnagramObject[]) => {
                            socket.emit(Events.NEW_GAMES, games);
                        });
                    }

                    callback(res);
                });

        });

        socket.on(Events.CREATE_GAME, (target_usernames: string[], callback: (game: AnagramObject) => void) => {
            console.log('Creating game from: ', socket.user.username, ' for: ', target_usernames);

            DB.getUsersByName(target_usernames, (users: User[]) => {
                let target_users = users;
                target_users.push(socket.user);

                const game = AUtil.generateGame(target_users);

                DB.createAnagramGame(game, (db_game: AnagramObject) => {
                    const room = db_game._id;

                    this.sockets_list.filter(list_socket =>
                        target_users.map(target_user => target_user.user_id).includes(list_socket.user.user_id))
                        .forEach(target_socket => {
                            console.log(target_socket.user.username, ' joined game ', db_game._id);
                            target_socket.join(room);
                        });

                    socket.broadcast.to(room).emit(Events.NEW_GAMES, [db_game]);

                    callback(db_game);
                });
            });
        });

        socket.on(Events.SET_USERNAME, (username: string, callback: (res: User | Error) => void) => {
            console.log('Setting username for: ', socket.user.username, ' to: ', username);

            const new_user: User = {
                user_id: socket.user.user_id,
                username: username
            };

            DB.setUsername(new_user, (res: User | Error) => {
                if (!(res instanceof Error)) {
                    socket.user = new_user;
                }

                callback(res);
            });
        });

        socket.on(Events.UPDATE_GAME_STATE, (_id: string, new_state: AnagramState) => {
            console.log('Updating game id ', _id, ' from: ', socket.user.username, ' with: ', new_state);

            const unview: boolean = !(Object.keys(new_state).length == 1 && Object.keys(new_state)[0] == 'viewed');

            DB.updateAnagramGame(socket.user, _id, new_state, () => {
                socket.broadcast.to(_id).emit(Events.UPDATE_GAME_STATE, _id, socket.user, new_state, unview);
            });
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected!');

            //this.sockets = this.sockets.filter(list_socket => !list_socket.disconnected);
        });
    }
}