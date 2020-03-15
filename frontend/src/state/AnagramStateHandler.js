export default class AnagramStateHandler {
    constructor(game_object, user_id) {
        this.uuid = game_object.uuid;
        this.states = game_object.states;
        this.config = game_object.config;

        this.user_id = user_id;
    }

    getState(user_id) {
        return this.states[user_id];
    }

    getLocalState() {
        return this.getState(this.user_id);
    }

    setState(user_id, state) {
        this.states[user_id] = {
            ...this.states[user_id],
            ...state
        }
    }

    setLocalState(state) {
        this.setState(this.user_id, state)
    }

    scoreWordOnLocalState(word) {
        this.states[this.user_id].words.push(word);
        this.states[this.user_id].score = this.states[this.user_id].score + word.length * 100;
    }

    getObject() {
        return {
            uuid: this.uuid,
            states: this.states,
            config: this.config
        }
    }
}