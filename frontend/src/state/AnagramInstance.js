/*
 * Game Object:
 * {
 *   running: boolean
 *   letters: String arr ex. ["E", "T", "C"... ],
 *   time: int un. seconds
 *   score: int un. Points
 *   words: String arr ex. ["lorem", "ipsum"...]
 * }
 *
 */

export default class AnagramInstance {
    constructor(id) {
        this.id = id;

        this.state = {
            words: [],
            running: true,
            score: 0,
        };

        this.config = {
            letters: [],
            duration: 0,
        }
    }

    setConfig(config) {
        this.config = config;
    }

    setState(state) {
        this.state = state;
    }

    addWord(word) {
        this.state.words.push(word);

        this.state.score += 100 * word.length;
    }
}