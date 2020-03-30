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
    uuid: string,
    states: {
        [user_id: string]: AnagramState
    },
    users: User[],
    config: AnagramConfig
}

export interface User {
    user_id: string,
    username: string
}


