import MicroEmitter from 'micro-emitter';

class GameDB {
    constructor() {
        this.words = [];
    }

    addWord(word) {
        this.words.push(word);
    }

    isWordScored(word) {
        return this.words.includes(word);
    }
}

export default new GameDB();