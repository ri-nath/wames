"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const IO = require("socket.io");
const api_1 = require("./api");
const db_1 = require("./db");
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = IO(server);
server.listen(port, () => api_1.log('Server listening on port ', port));
app.get('/', (req, res) => {
    res.sendFile(__dirname + './index.html');
});
var Events;
(function (Events) {
    Events["ERROR"] = "error";
    Events["REQUEST_IDENTIFIER"] = "req-id";
    Events["REGISTER_USER"] = "register-user";
    Events["DATA"] = "data";
    Events["NEW_GAMES"] = "new-games";
    Events["CREATE_GAME"] = "create-game";
    Events["SET_USERNAME"] = "user-id";
    Events["UPDATE_GAME_STATE"] = "update-game-state";
    Events["MARK_AS_VIEWED"] = "view";
    Events["JOIN_GAME"] = "join";
})(Events || (Events = {}));
let sockets = [];
const register_user = (identifier, socket, next) => {
    api_1.log('Registering user: ', identifier);
    db_1.registerUser(identifier, res => {
        if (api_1.isError(res)) {
            socket.emit(Events.ERROR, res);
            return;
        }
        api_1.log('Resolved user: ', res);
        socket['user'] = res;
        sockets.push(socket);
        db_1.getUserAnagramGames(res, (games) => {
            socket.emit(Events.DATA, res, games);
        });
        next();
    });
};
io.use((socket, next) => {
    api_1.log('A socket is attempting to connect from ', socket.handshake.address);
    const handshake_data = socket.request;
    if (handshake_data._query.deviceid) {
        register_user(handshake_data._query.deviceid, socket, next);
    }
    else {
        socket.disconnect();
    }
});
io.on('connection', (socket) => {
    api_1.log(socket.user.username, 'connected from', socket.handshake.address);
    socket.on(Events.CREATE_GAME, (target_usernames, callback) => {
        api_1.log('Creating game from: ', socket.user.username, ' for: ', target_usernames);
        db_1.getUsersByName(target_usernames, (users) => {
            let target_users = users;
            target_users.push(socket.user);
            const game = api_1.generateGame(target_users);
            db_1.createAnagramGame(game, (db_game) => {
                const room = db_game._id;
                sockets.filter(list_socket => target_users.map(target_user => target_user.user_id).includes(list_socket.user.user_id))
                    .forEach(target_socket => {
                    api_1.log(target_socket.user.username, ' joined game ', db_game._id);
                    target_socket.join(room);
                });
                socket.broadcast.to(room).emit(Events.NEW_GAMES, [db_game]);
                callback(db_game);
            });
        });
    });
    socket.on(Events.JOIN_GAME, (id, callback) => {
        if (!socket['user']) {
            callback(api_1.createError('REJECTED', 'User not registered!'));
        }
        else {
            api_1.log('Joining game ', id, ' for user ', socket.user.username);
            db_1.getAnagramGame(id, res => {
                if (api_1.isAnyError(res)) {
                    callback(api_1.pipeToWamesError(res));
                }
                else {
                    if (res.users.some(user => user.user_id === socket.user.user_id)) {
                        callback(api_1.createError('REJECTED', 'Already in game!'));
                    }
                    else {
                        db_1.joinAnagramGame(id, socket.user, (res) => {
                            if (api_1.isAnyError(res)) {
                                callback(api_1.pipeToWamesError(res));
                            }
                            else {
                                socket.broadcast.to(res._id).emit(Events.UPDATE_GAME_STATE, id, socket.user, res.states[socket.user.user_id]);
                                callback(res);
                            }
                        });
                    }
                }
            });
        }
    });
    socket.on(Events.SET_USERNAME, (username, callback) => {
        if (!socket['user']) {
            callback(api_1.createError('REJECTED', 'User not registered!'));
        }
        else {
            api_1.log('Setting username for: ', socket.user.username, ' to: ', username);
            const new_user = {
                user_id: socket.user.user_id,
                username: username
            };
            db_1.setUsername(new_user, (res) => {
                console.log(res);
                if (api_1.isAnyError(res)) {
                    callback(api_1.pipeToWamesError(res));
                }
                else {
                    socket.user = res;
                    callback(res);
                }
            });
        }
    });
    socket.on(Events.UPDATE_GAME_STATE, (_id, new_state, callback) => {
        if (!socket['user']) {
            callback(api_1.createError('REJECTED', 'User not registered!'));
        }
        else {
            api_1.log('Updating game id ', _id, ' from: ', socket.user.username, ' with: ', new_state);
            db_1.updateAnagramGame(socket.user, _id, new_state, (res) => {
                if (api_1.isAnyError(res)) {
                    callback(api_1.pipeToWamesError(res));
                }
                else {
                    socket.broadcast.to(_id).emit(Events.UPDATE_GAME_STATE, _id, socket.user, new_state);
                }
            });
        }
    });
    socket.on(Events.MARK_AS_VIEWED, (_id, callback) => {
        if (!socket['user']) {
            callback(api_1.createError('REJECTED', 'User not registered!'));
        }
        else {
            api_1.log('Marking game id ', _id, ' as viewed for ', socket.user.username);
            db_1.markAnagramGameAsViewed(socket.user, _id, callback);
        }
    });
    socket.on('disconnect', () => {
        api_1.log('A user disconnected!');
        //this.sockets = this.sockets.filter(list_socket => !list_socket.disconnected);
    });
});
//# sourceMappingURL=index.js.map