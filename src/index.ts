import * as express from 'express';
import * as http from 'http';
import { Socket } from 'socket.io';
import * as IO from 'socket.io';

import { Acknowledgement, AnagramObject, AnagramState, DecoratedSocket, User } from './ts';
import { createError, generateGame, isAnyError, isError, log, pipeToWamesError } from './api';
import {
    createAnagramGame,
    getAnagramGame,
    getUserAnagramGames,
    getUsersByName,
    joinAnagramGame, markAnagramGameAsViewed,
    registerUser, setUsername, updateAnagramGame
} from './db';

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = IO(server);

server.listen(port, () => log('Server listening on port ', port));

app.get('/', (req, res) => {
    res.sendFile(__dirname + './index.html');
});

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

let sockets = [] as DecoratedSocket[];

const register_user = (identifier: string, socket: Socket, next: Function) => {
    log('Registering user: ', identifier);

    registerUser(identifier,res => {
        if (isError(res)) {
            socket.emit(Events.ERROR, res as unknown as Error);
            return;
        }

        log('Resolved user: ', res);

        socket['user'] = res;

        sockets.push(socket as DecoratedSocket);

        getUserAnagramGames(res as User, (games: AnagramObject[]) => {
            socket.emit(Events.DATA, res, games);
        });

        next();
    });
};

io.use((socket: Socket, next) => {
    log('A socket is attempting to connect from ', socket.handshake.address);

    const handshake_data = socket.request;

    if (handshake_data._query.deviceid) {
        register_user(handshake_data._query.deviceid, socket, next);
    } else {
        socket.disconnect();
    }
});

io.on('connection', (socket: DecoratedSocket) => {
    log(socket.user.username, 'connected from', socket.handshake.address);

    socket.on(Events.CREATE_GAME, (target_usernames: string[], callback: Acknowledgement<AnagramObject>) => {
        log('Creating game from: ', socket.user.username, ' for: ', target_usernames);

        getUsersByName(target_usernames, (users: User[]) => {
            let target_users = users;
            target_users.push(socket.user);

            const game = generateGame(target_users);

            createAnagramGame(game, (db_game: AnagramObject) => {
                const room = db_game._id;

                sockets.filter(list_socket =>
                    target_users.map(target_user => target_user.user_id).includes(list_socket.user.user_id))
                    .forEach(target_socket => {
                        log(target_socket.user.username, ' joined game ', db_game._id);
                        target_socket.join(room);
                    });

                socket.broadcast.to(room).emit(Events.NEW_GAMES, [db_game]);

                callback(db_game);
            });
        });
    });

    socket.on(Events.JOIN_GAME, (id: string, callback: Acknowledgement<AnagramObject>) => {
        if (!socket['user']) {
            callback(createError('REJECTED', 'User not registered!'));
        } else {
            log('Joining game ', id, ' for user ', socket.user.username);

            getAnagramGame(id, res => {
                if (isAnyError(res)) {
                    callback(pipeToWamesError(res as unknown as Error));
                } else {
                    if ((res as AnagramObject).users.some(user => user.user_id === socket.user.user_id)) {
                        callback(createError('REJECTED', 'Already in game!'));
                    } else {
                        joinAnagramGame(id, socket.user, (res) => {
                            if (isAnyError(res)) {
                                callback(pipeToWamesError(res as unknown as Error));
                            } else {
                                socket.broadcast.to((res as AnagramObject)._id).emit(Events.UPDATE_GAME_STATE, id, socket.user, (res as AnagramObject).states[socket.user.user_id]);

                                callback(res);
                            }

                        });
                    }
                }
            });
        }
    });

    socket.on(Events.SET_USERNAME, (username: string, callback: Acknowledgement<User>) => {
        if (!socket['user']) {
            callback(createError('REJECTED', 'User not registered!'));
        } else {
            log('Setting username for: ', socket.user.username, ' to: ', username);

            const new_user: User = {
                user_id: socket.user.user_id,
                username: username
            };

            setUsername(new_user, (res) => {
                console.log(res);
                if (isAnyError(res)) {
                    callback(pipeToWamesError(res as unknown as Error));
                } else {
                    socket.user = res as User;
                    callback(res as User);
                }
            });
        }
    });

    socket.on(Events.UPDATE_GAME_STATE, (_id: string, new_state: AnagramState, callback: Acknowledgement<void>) => {
        if (!socket['user']) {
            callback(createError('REJECTED', 'User not registered!'));
        } else {
            log('Updating game id ', _id, ' from: ', socket.user.username, ' with: ', new_state);

            updateAnagramGame(socket.user, _id, new_state, (res) => {
                log(res);

                if (isAnyError(res)) {
                    callback(pipeToWamesError(res as unknown as Error));
                } else {
                    socket.broadcast.to(_id).emit(Events.UPDATE_GAME_STATE, _id, socket.user, new_state);
                }
            });
        }
    });

    socket.on(Events.MARK_AS_VIEWED, (_id: string, callback: Acknowledgement<void>) => {
        if (!socket['user']) {
            callback(createError('REJECTED', 'User not registered!'));
        } else {
            log('Marking game id ', _id, ' as viewed for ', socket.user.username);

            markAnagramGameAsViewed(socket.user, _id, callback);
        }
    });

    socket.on('disconnect', () => {
        log('A user disconnected!');

        //this.sockets = this.sockets.filter(list_socket => !list_socket.disconnected);
    });
});


