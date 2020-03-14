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
    constructor(uuid) {
        this.uuid = uuid;

        this.state = {
            running: true,

            letters: [],
            words: [],

            time: 0,
            score: 0,
        };
    }

    setState(state) {
        this.state = state;
    }

    addWord(word) {
        this.state.words.push(word);

        this.state.score += 100 * word.length;
    }
}