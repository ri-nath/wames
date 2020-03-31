"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monk_1 = require("monk");
const unique_names_generator_1 = require("unique-names-generator");
const name_config = {
    dictionaries: [unique_names_generator_1.adjectives, unique_names_generator_1.animals],
    separator: '',
    style: 'capital',
    length: 2
};
class DB {
    constructor() {
        this.db = monk_1.default(process.env.DB_URI);
        this.anagrams = this.db.get('anagram-games');
        this.users = this.db.get('users');
    }
    // ANAGRAM METHODS
    createAnagramGame(game_object, callback) {
        this.anagrams.insert(game_object)
            .then(callback)
            .catch(console.error);
    }
    updateAnagramGame(updating_user, game_id, updated_state, callback) {
        this.anagrams.findOneAndUpdate({ _id: game_id }, { $set: { ['states.' + updating_user.user_id]: updated_state } })
            .then(callback)
            .catch(console.error);
    }
    markAnagramGameAsViewed(user, game_id) {
        this.anagrams.findOneAndUpdate({ _id: game_id }, { $set: { ['states.' + user.user_id + '.viewed']: true } })
            .catch(console.error);
    }
    getUserAnagramGames(user, callback) {
        this.anagrams.find({
            ['states.' + user.user_id]: { $exists: true }
        })
            .then(callback)
            .catch(console.error);
    }
    generateUsername(callback) {
        let username = unique_names_generator_1.uniqueNamesGenerator(name_config);
        this.users.find({
            username: username,
        }).then((docs) => {
            if (docs.length > 0) {
                this.generateUsername(callback);
            }
            else {
                callback(username);
            }
        });
    }
    ;
    // USER METHODS
    registerUser(user_id, callback) {
        this.users.find({
            user_id: user_id
        })
            .then(docs => {
            if (docs.length > 0) {
                callback(docs[0]);
            }
            else {
                this.generateUsername(username => {
                    this.users.insert({
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
    setUsername(user, callback) {
        if (user.username === '')
            callback(Error("Username cannot be empty!"));
        this.users.find({
            username: user.username
        })
            .then((docs) => {
            if (docs.length > 0) {
                callback(Error("Username is taken! " + docs[0].username));
            }
            else {
                this.users.findOneAndUpdate({ user_id: user.user_id }, { $set: { username: user.username } })
                    .then(callback)
                    .catch(console.error);
            }
        })
            .catch(console.error);
    }
    getUserByName(username, callback) {
        this.users.findOne({
            username: username
        })
            .then(callback)
            .catch(console.error);
    }
    getUsersByName(usernames, callback) {
        this.users.find({
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
}
exports.default = new DB();
//# sourceMappingURL=Database.js.map