"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unique_names_generator_1 = require("unique-names-generator");
const DB_1 = require("./DB");
function generateUsername(callback) {
    let username = unique_names_generator_1.uniqueNamesGenerator({
        dictionaries: [unique_names_generator_1.adjectives, unique_names_generator_1.animals],
        separator: '',
        style: 'capital',
        length: 2
    });
    DB_1.default.users.find({
        username: username,
    }).then((docs) => {
        if (docs.length > 0) {
            generateUsername(callback);
        }
        else {
            callback(username);
        }
    });
}
exports.generateUsername = generateUsername;
;
function registerUser(user_id, callback) {
    DB_1.default.users.find({
        user_id: user_id
    })
        .then(docs => {
        if (docs.length > 0) {
            callback(docs[0]);
        }
        else {
            generateUsername(username => {
                DB_1.default.users.insert({
                    user_id: user_id,
                    username: username,
                })
                    .then(callback)
                    .catch(console.error);
            });
        }
    })
        .catch(console.error);
}
exports.registerUser = registerUser;
function setUsername(user, callback) {
    if (user.username === '')
        callback(Error("Username cannot be empty!"));
    DB_1.default.users.find({
        username: user.username
    })
        .then((docs) => {
        if (docs.length > 0) {
            callback(Error("Username is taken! " + docs[0].username));
        }
        else {
            DB_1.default.users.findOneAndUpdate({ user_id: user.user_id }, { $set: { username: user.username } })
                .then(callback)
                .catch(console.error);
        }
    })
        .catch(console.error);
}
exports.setUsername = setUsername;
function getUserByName(username, callback) {
    DB_1.default.users.findOne({
        username: username
    })
        .then(callback)
        .catch(console.error);
}
exports.getUserByName = getUserByName;
function getUsersByName(usernames, callback) {
    if (usernames.length === 0) {
        console.log('getUsersByName called on empty array!');
        callback([]);
    }
    DB_1.default.users.find({
        $or: usernames.reduce((acc, cur) => {
            acc.push({
                username: cur
            });
            return acc;
        }, [])
    })
        .then(callback)
        .catch(console.error);
}
exports.getUsersByName = getUsersByName;
//# sourceMappingURL=data.js.map