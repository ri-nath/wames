"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("./DB");
const api_1 = require("../api");
function createAnagramGame(game_object, callback) {
    DB_1.default.anagrams.insert(game_object)
        .then(callback)
        .catch(console.error);
}
exports.createAnagramGame = createAnagramGame;
function updateAnagramGame(updating_user, game_id, updated_state, callback) {
    DB_1.default.anagrams.findOneAndUpdate({ _id: game_id }, { $set: { ['states.' + updating_user.user_id]: updated_state } })
        .then(callback)
        .catch(console.error);
}
exports.updateAnagramGame = updateAnagramGame;
function markAnagramGameAsViewed(user, game_id) {
    DB_1.default.anagrams.findOneAndUpdate({ _id: game_id }, { $set: { ['states.' + user.user_id + '.viewed']: true } })
        .catch(console.error);
}
exports.markAnagramGameAsViewed = markAnagramGameAsViewed;
function getUserAnagramGames(user, callback) {
    DB_1.default.anagrams.find({
        ['states.' + user.user_id]: { $exists: true }
    })
        .then(callback)
        .catch(console.error);
}
exports.getUserAnagramGames = getUserAnagramGames;
function joinAnagramGame(id, user, callback) {
    DB_1.default.anagrams.findOneAndUpdate({ _id: id }, { $set: { ['states.' + user.user_id]: api_1.defaultState }, $push: { users: user } })
        .then(callback)
        .catch(console.error);
}
exports.joinAnagramGame = joinAnagramGame;
function getAnagramGame(id, callback) {
    DB_1.default.anagrams.findOne({ _id: id })
        .then(callback)
        .catch(console.error);
}
exports.getAnagramGame = getAnagramGame;
//# sourceMappingURL=anagram.js.map