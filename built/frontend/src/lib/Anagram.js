"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Anagram {
    constructor(game_object, local_user_id) {
        this.game_object = game_object;
        this.local_user_id = local_user_id;
    }
    getID() {
        return this.game_object.uuid;
    }
    getConfig() {
        return this.game_object.config;
    }
    getState(user_id) {
        return this.game_object.states[user_id];
    }
    getLocalState() {
        return this.getState(this.local_user_id);
    }
    setState(username, state) {
        this.game_object.states[username] = Object.assign(Object.assign({}, this.game_object.states[username]), state);
    }
    setLocalState(state) {
        this.setState(this.local_user_id, state);
    }
    lazyScoreWord(word) {
        this.getLocalState().words.push(word);
        this.getLocalState().score = this.getLocalState().score + word.length * 100;
    }
    getPlayers() {
        return this.game_object.users;
    }
    getObject() {
        return this.game_object;
    }
    hasBeenViewed() {
        return this.getLocalState().viewed;
    }
}
exports.default = Anagram;
//# sourceMappingURL=Anagram.js.map