import { User } from './data';

export type AnagramStage = 'NOT-STARTED' | 'RUNNING' | 'FINISHED';

export interface AnagramState {
    stage: AnagramStage,
    words: string[],
    score: number,
    viewed: boolean
}

export interface AnagramConfig {
    letters: string[],
    duration: number
}

export interface AnagramObject {
    _id: string,
    states: {
        [user_id: string]: AnagramState
    },
    users: User[],
    config: AnagramConfig
}



