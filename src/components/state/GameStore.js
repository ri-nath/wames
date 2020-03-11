import MicroEmitter from 'micro-emitter';

class GameStore {
    constructor() {
        this.event_emitter = new MicroEmitter();
    }

    addPoints(points) {
        this.event_emitter.emit('ADD_POINTS', points);
    }

    onAddPoints(handler) {
        this.event_emitter.on('ADD_POINTS', handler);
    }
}

export default new GameStore();