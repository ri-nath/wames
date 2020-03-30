import MicroEmitter from 'micro-emitter';

export type WamesListener = {
    off: Function;
}

export default class WamesEmitter extends MicroEmitter {
    constructor() {
        super();
    }

    wrappedListen(type: string, listener: any): WamesListener {
        super.on(type, listener);

        return {
            off: () => super.off(type, listener)
        }
    }
}